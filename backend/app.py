from fileinput import filename
import os
import jwt
import datetime
from functools import wraps
from flask import Flask, jsonify , request
from flask_cors import CORS
from dotenv import load_dotenv
from config.db import get_db_connection
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
import bcrypt
from google.cloud import storage

# Load your local .env file BEFORE anything else
load_dotenv()


# Import your blueprints
from routes.auth import auth_bp
from routes.blogs import blogs_bp

app = Flask(__name__)

# Allow your local React app and production site to connect
CORS(
    app,
    origins=[
        "http://localhost:5173",
        "https://chess-club-iitk-myfork.vercel.app"
    ]
)

app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(blogs_bp, url_prefix='/api')


import bcrypt # <--- MUST BE AT THE TOP OF app.py

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
                
            # 4. Generate the JWT with their specific role!
            payload = {
                'user_id': user[0],
                'role': user_role, # <--- The token now remembers if they are a secretary or a member
                'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
            }
            
            token = jwt.encode(payload, 'JWT_SECRET', algorithm='HS256')
            
            # Optional: We can also send the role back in the JSON so React knows instantly
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
        # Remove the dictionary=True argument
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
            # Tokens are usually sent as "Bearer <token>"
            token = request.headers['Authorization'].split(" ")[1]
            
        if not token:
            return jsonify({'error': 'Token is missing! Access denied.'}), 401
            
        try:
            # 2. Try to decode the token using the SAME hardcoded secret key
            data = jwt.decode(token, 'JWT_SECRET', algorithms=['HS256'])
            
            # 3. Check if they have the right role
            if data['role'] != 'secretary':
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
        # 1. Grab the physical file from the request
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400
            
        file = request.files['image']
        
        filename = secure_filename(file.filename)

        # Upload straight to Google Cloud
        storage_client = storage.Client()
        bucket = storage_client.bucket('chess-club-iitk-media')
        blob = bucket.blob(f"Gallery/{filename}")
        blob.upload_from_string(file.read(), content_type=file.content_type)

        # Save the permanent cloud URL to your database
        db_path = blob.public_url
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO featured_carousel (image_url) VALUES (%s)", (db_path,))
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Image uploaded successfully!", "url": db_path}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/carousel', methods=['GET'])
def get_carousel_images():
    try:
        conn = get_db_connection()
        cursor = conn.cursor() 
        
        # Grab all the saved images
        cursor.execute("SELECT id, image_url FROM featured_carousel ORDER BY id DESC")
        
        # Safely and universally convert the SQL rows into a JSON dictionary
        row_headers = [x[0] for x in cursor.description]
        images = [dict(zip(row_headers, row)) for row in cursor.fetchall()]
        
        cursor.close()
        conn.close()
        
        return jsonify(images), 200
        
    except Exception as e:
        print(f"GET CAROUSEL ERROR: {e}") # This will print the exact crash reason to your terminal!
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/carousel/<int:image_id>', methods=['DELETE'])
@token_required
def delete_carousel_image(image_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Note: In a production app, you would also use os.remove() here 
        # to delete the physical file from the static/uploads folder. 
        # For now, we just remove it from the database so it disappears from the website!
        cursor.execute("DELETE FROM featured_carousel WHERE id = %s", (image_id,))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Image deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# 1. PUBLIC ROUTE: Anyone can read the text (No @token_required here)
@app.route('/api/config/featured', methods=['GET'])
def get_featured_config():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT config_key, config_value FROM site_config WHERE config_key IN ('featured_title', 'featured_desc')")
        rows = cursor.fetchall()
        
        # Convert tuples to dictionary
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

    # 1. Update your database/JSON file to remove this URL from the array
    
    conn = get_db_connection()
    cursor = conn.cursor()
        
    # Delete the record that has this specific image URL
    cursor.execute("DELETE FROM gallery WHERE image_url = %s", (image_url_to_delete,))
        
    conn.commit()
    cursor.close()
    conn.close()
        # ---------------------

    # 2. (Optional but recommended) Delete the actual file from your uploads folder
    try:
        filename = image_url_to_delete.split('/')[-1]
        storage_client = storage.Client()
        bucket = storage_client.bucket('chess-club-iitk-media')
        blob = bucket.blob(f"Gallery/{filename}")

        if blob.exists():
            blob.delete()
    except Exception as e:
        print(f"Error deleting file: {e}")

    return jsonify({"message": "Photo deleted successfully"}), 200


@app.route('/api/gallery/memories/replace', methods=['POST'])
@token_required 
def replace_memory():
    if 'new_image' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file = request.files['new_image']
    old_image_url = request.form.get('old_image_url')
    index = request.form.get('index')

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if file:
        # 1. Save the new file
        filename = secure_filename(file.filename)

        storage_client = storage.Client()
        bucket = storage_client.bucket('chess-club-iitk-media')
        new_blob = bucket.blob(f"Gallery/{filename}")
        new_blob.upload_from_string(file.read(), content_type=file.content_type)

        new_image_url = new_blob.public_url

        # 2. Update your database/JSON file to swap the old URL with the new_image_url at the specific index
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Find the row with the old URL and overwrite it with the new URL
        cursor.execute(
            "UPDATE gallery SET image_url = %s WHERE image_url = %s", 
            (new_image_url, old_image_url)
        )
        
        conn.commit()
        cursor.close()
        conn.close()
        # ---------------------

        # 3. (Optional) Delete the old file from the server to save space
        try:
            old_filename = old_image_url.split('/')[-1]
            storage_client = storage.Client()
            bucket = storage_client.bucket('chess-club-iitk-media')
            old_blob = bucket.blob(f"Gallery/{old_filename}")

            if old_blob.exists():
                old_blob.delete()
        except Exception as  e:
            print(f"Error deleting old file: {e}")

        return jsonify({"message": "Photo replaced", "new_image_url": new_image_url}), 200
# 2. PROTECTED ROUTE: Only Admins can save changes
@app.route('/api/config/featured', methods=['PUT'])
@token_required # <-- The Vault Door is ONLY on the PUT request now!
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
    

    

# This MUST be at the very bottom of the file
if __name__ == "__main__":
    # Local development settings with auto-reload enabled
    app.run(debug=True)