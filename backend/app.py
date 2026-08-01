import os
import jwt
import datetime
from functools import wraps
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from config.db import get_db_connection
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
import bcrypt
from flask_jwt_extended import JWTManager, create_access_token
import bcrypt 
# Load your local .env file BEFORE anything else
load_dotenv()

# Import your blueprints
from routes.auth import auth_bp
from routes.blogs import blogs_bp
from routes.events import events_bp

app = Flask(__name__)
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET")
app.config["JWT_SECRET"] = os.environ.get("JWT_SECRET")
jwt_manager = JWTManager(app)

# --- LOCAL UPLOAD DIRECTORY SETUP ---
# Defines the path: backend/static/uploads
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static', 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Automatically create the folder if it doesn't exist yet
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Allow your local React app and production site to connect
CORS(
    app,
    origins=[
        "http://localhost:5173",
        "https://chess-club-iitk-myfork.vercel.app",
        "https://chess-club-iitk-w7u5.vercel.app"
    ]
)

app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(blogs_bp, url_prefix='/api')
app.register_blueprint(events_bp)

# <--- MUST BE AT THE TOP OF app.py

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username') # This can be their email or chess_username
        password = data.get('password')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT id, is_admin, password_hash FROM users WHERE email = %s OR chess_username = %s", 
            (username, username)
        )
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        # 1. THE FIX: Use bcrypt to check the password instead of check_password_hash
        # user[2] contains the hashed string from the DB
        # 2. Check if user exists and password matches the hash
        if user and bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
            
            # --- THE FIX IS HERE ---
            # Instead of blocking non-admins, we assign them a different role!
            # user[1] is the is_admin column from your SQL database
            user_role = 'secretary' if user[1] else 'member'
                
            user_email = username if '@' in username else ""
            additional_claims = {"role": user_role, "is_admin": user[1], "user_id": user[0]}
            token = create_access_token(identity=user_email, additional_claims=additional_claims)
            
            return jsonify({'token': token, 'role': user_role}), 200
            
        return jsonify({'error': 'Invalid username or password.'}), 401
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health")
def health():
    return {"status": "ok"}


@app.route("/db-test")
def db_test():
    conn = get_db_connection()
    conn.close()
    return {"database": "connected"}


@app.route('/api/gallery', methods=['GET'])
def get_gallery():
    try:
        conn = get_db_connection()
        cursor = conn.cursor() 
        
        cursor.execute("SELECT id, image_url, category, album_type, title, description FROM gallery ORDER BY created_at DESC")
        
        # 1. Get the column names from the cursor
        columns = [col[0] for col in cursor.description]
        
        # 2. Fetch all rows and manually zip them into dictionaries
        images = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        cursor.close()
        conn.close()
        
        return jsonify(images), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # 1. Check if the frontend sent a token in the headers
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
            
        if not token:
            return jsonify({'error': 'Token is missing! Access denied.'}), 401
            
        try:
            data = jwt.decode(token, app.config["JWT_SECRET_KEY"], algorithms=['HS256'])
            
            # Flask-JWT-Extended nests claims inside a top-level property dictionary
            claims = data.get('sub') or data
            role_to_check = data.get('role')
            
            if role_to_check != 'secretary':
                return jsonify({'error': 'Admin privileges required.'}), 403
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired. Please log in again.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token.'}), 401
            
        return f(*args, **kwargs)
    return decorated


@app.route('/api/carousel', methods=['POST'])
@token_required
def upload_carousel_image():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400
            
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        filename = secure_filename(file.filename)
        
        # --- LOCAL FILE UPLOAD ---
        # 1. Construct the physical path on your laptop/server
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # 2. Save the file directly to the static/uploads folder
        file.save(file_path)

        # 3. Create the relative URL path to save in your SQL database
        db_path = f"/static/uploads/{filename}"
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO featured_carousel (image_url) VALUES (%s) RETURNING id", (db_path,))
        # Get the ID of the newly inserted row to return to the frontend
        new_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        
        # Return the new image object so React can display it instantly without refreshing
        return jsonify({
            "message": "Image uploaded successfully!", 
            "id": new_id,
            "image_url": db_path
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/carousel', methods=['GET'])
def get_carousel_images():
    try:
        conn = get_db_connection()
        cursor = conn.cursor() 
        
        cursor.execute("SELECT id, image_url FROM featured_carousel ORDER BY id DESC")
        
        row_headers = [x[0] for x in cursor.description]
        images = [dict(zip(row_headers, row)) for row in cursor.fetchall()]
        
        cursor.close()
        conn.close()
        
        return jsonify(images), 200
        
    except Exception as e:
        print(f"GET CAROUSEL ERROR: {e}") 
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/carousel/<int:image_id>', methods=['DELETE'])
@token_required
def delete_carousel_image(image_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 1. Fetch the image URL first so we know what physical file to delete
        cursor.execute("SELECT image_url FROM featured_carousel WHERE id = %s", (image_id,))
        row = cursor.fetchone()
        
        if row:
            image_url = row[0] # e.g., "/static/uploads/Cat.jpeg"
            
            # --- LOCAL FILE DELETION ---
            # Remove the leading slash to make it a valid path for os.remove
            file_path_to_delete = os.path.join(os.getcwd(), image_url.lstrip('/'))
            
            if os.path.exists(file_path_to_delete):
                os.remove(file_path_to_delete)
        
        # 2. Delete the record from the database
        cursor.execute("DELETE FROM featured_carousel WHERE id = %s", (image_id,))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Image deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/config/featured', methods=['GET'])
def get_featured_config():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT config_key, config_value FROM site_config WHERE config_key IN ('featured_title', 'featured_desc')")
        rows = cursor.fetchall()
        
        config_dict = {row[0]: row[1] for row in rows}
        
        cursor.close()
        conn.close()
        return jsonify(config_dict), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/gallery/memories', methods=['DELETE'])
@token_required 
def delete_memory():
    data = request.get_json()
    image_url_to_delete = data.get('image_url')
    
    if not image_url_to_delete:
        return jsonify({"error": "No image URL provided"}), 400

    # --- LOCAL FILE DELETION ---
    try:
        # e.g., if URL is "/static/uploads/image.jpg", remove leading slash
        file_path_to_delete = os.path.join(os.getcwd(), image_url_to_delete.lstrip('/'))
        
        if os.path.exists(file_path_to_delete):
            os.remove(file_path_to_delete)
    except Exception as e:
        print(f"Error deleting physical file: {e}")

    # Delete from Database
    conn = get_db_connection()
    cursor = conn.cursor()
        
    cursor.execute("DELETE FROM gallery WHERE image_url = %s", (image_url_to_delete,))
        
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Photo deleted successfully"}), 200


@app.route('/api/gallery/memories/replace', methods=['POST'])
@token_required 
def replace_memory():
    if 'new_image' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file = request.files['new_image']
    old_image_url = request.form.get('old_image_url')

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if file:
        # --- LOCAL FILE UPLOAD & DELETE ---
        # 1. Save the new file locally
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        new_image_url = f"/static/uploads/{filename}"

        # 2. Update Database with the new local path
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "UPDATE gallery SET image_url = %s WHERE image_url = %s", 
            (new_image_url, old_image_url)
        )
        
        conn.commit()
        cursor.close()
        conn.close()

        # 3. Delete the old physical file to save space
        try:
            if old_image_url:
                old_file_path = os.path.join(os.getcwd(), old_image_url.lstrip('/'))
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)
        except Exception as e:
            print(f"Error deleting old physical file: {e}")

        return jsonify({"message": "Photo replaced", "new_image_url": new_image_url}), 200

@app.route('/api/config/featured', methods=['PUT'])
@token_required 
def update_featured_config():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("UPDATE site_config SET config_value = %s WHERE config_key = 'featured_title'", (data['title'],))
        cursor.execute("UPDATE site_config SET config_value = %s WHERE config_key = 'featured_desc'", (data['description'],))
        
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Successfully updated!"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Local development settings with auto-reload enabled
    app.run(debug=True)