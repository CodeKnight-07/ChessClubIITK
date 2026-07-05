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

# Load your local .env file BEFORE anything else
load_dotenv()

# Import your blueprints
from routes.auth import auth_bp

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
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }
            
            token = jwt.encode(payload, 'IITKCHESSCLUBSECRETKEYDONOTSHARE', algorithm='HS256')
            
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
            data = jwt.decode(token, 'IITKCHESSCLUBSECRETKEYDONOTSHARE', algorithms=['HS256'])
            
            # 3. Check if they have the right role
            if data['role'] != 'secretary':
                return jsonify({'error': 'Admin privileges required.'}), 403
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired. Please log in again.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token.'}), 401
            
        return f(*args, **kwargs)
    return decorated

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