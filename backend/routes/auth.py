import os
import random
import smtplib
from email.mime.text import MIMEText
from flask import Blueprint, request, jsonify
import bcrypt
import pymysql
import requests
from config.db import get_db_connection

# 1. ALWAYS initialize the Blueprint first!
auth_bp = Blueprint('auth', __name__)

# --- HELPER FUNCTIONS ---

def send_custom_email(receiver_email, subject, body):
    """Generic helper function to handle securely emailing IITK students via SMTP"""
    sender_email = os.environ.get("EMAIL_SENDER")
    sender_password = os.environ.get("EMAIL_PASSWORD")
    
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = receiver_email

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(sender_email, sender_password)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Email Dispatch Failure: {e}")
        return False


# --- SIGNUP / OTP ROUTES ---

@auth_bp.route('/send-otp', methods=['POST'])
def generate_otp():
    data = request.get_json()
    email = data.get('email')

    if not email or not email.endswith('@iitk.ac.in'):
        return jsonify({"error": "You must use a valid @iitk.ac.in email address."}), 400

    otp = str(random.randint(100000, 999999))

    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Check if user already exists
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                return jsonify({"error": "This email is already registered."}), 409

            # Save/Renew temporary OTP record
            sql = """
                INSERT INTO pending_otps (email, otp) 
                VALUES (%s, %s) 
                ON DUPLICATE KEY UPDATE otp = VALUES(otp), created_at = CURRENT_TIMESTAMP
            """
            cursor.execute(sql, (email, otp))
            connection.commit()

        email_body = f"Welcome to the Sanctum!\n\nYour verification code is: {otp}\n\nUse this to complete your registration."
        if send_custom_email(email, 'Chess Club IITK - Verification Code', email_body):
            return jsonify({"message": "OTP sent successfully!"}), 200
        else:
            return jsonify({"error": "Failed to send email. Try again."}), 500

    except Exception as e:
        print(f"OTP Generation Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if connection and connection.open:
            connection.close()


@auth_bp.route('/verify-register', methods=['POST'])
def verify_and_register():
    data = request.get_json()
    email = data.get('email')
    user_otp = data.get('otp')
    password = data.get('password')
    chess_username = data.get('chess_username')

    if not all([email, user_otp, password, chess_username]):
        return jsonify({"error": "All fields are required."}), 400

    # 1. Validate Chess.com Username existence
    headers = {"User-Agent": "ChessClubIITK-Signup-App/1.0 (Contact: your_email@iitk.ac.in)"}
    chess_api_url = f"https://api.chess.com/pub/player/{chess_username.lower()}"
    
    try:
        chess_response = requests.get(chess_api_url, headers=headers, timeout=5)
        if chess_response.status_code == 404:
            return jsonify({"error": f"Chess.com ID '{chess_username}' does not exist."}), 400
        elif chess_response.status_code != 200:
            return jsonify({"error": "Could not verify Chess.com ID right now."}), 502
    except requests.exceptions.RequestException:
        return jsonify({"error": "Failed to connect to verification server."}), 502

    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # 2. Confirm OTP matches database
            cursor.execute("SELECT otp FROM pending_otps WHERE email = %s", (email,))
            record = cursor.fetchone()

            if not record or record[0] != user_otp:
                return jsonify({"error": "Invalid or expired OTP."}), 401

            # 3. Hash secret credentials safely
            salt = bcrypt.gensalt()
            password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
            
            cursor.execute(
                "INSERT INTO users (email, chess_username, password_hash) VALUES (%s, %s, %s)",
                (email, chess_username, password_hash)
            )
            
            # 4. Clean up transient database entries
            cursor.execute("DELETE FROM pending_otps WHERE email = %s", (email,))
            connection.commit()
            
            return jsonify({"message": "Account created successfully!"}), 201

    except Exception as e:
        print(f"Registration Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if connection and connection.open:
            connection.close()





# --- FORGOT / RESET PASSWORD ROUTES ---

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required."}), 400

    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # 1. Check if the user exists
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if not cursor.fetchone():
                return jsonify({"error": "No account found with that email."}), 404

            # 2. Generate and save OTP
            otp = str(random.randint(100000, 999999))
            sql = """
                INSERT INTO pending_otps (email, otp) VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE otp = VALUES(otp), created_at = CURRENT_TIMESTAMP
            """
            cursor.execute(sql, (email, otp))
            connection.commit()

        # 3. Send using your new generic email helper
        body = f"Forgot your password? Use this recovery code to reset it: {otp}\n\nIf you didn't request this, ignore it."
        if send_custom_email(email, "Chess Club IITK - Password Recovery", body):
            return jsonify({"message": "Password reset code sent!"}), 200
        else:
            return jsonify({"error": "Failed to send email. Try again."}), 500

    except Exception as e:
        print(f"Forgot Password Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if connection and connection.open:
            connection.close()


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    user_otp = data.get('otp') # Matches what React sends
    new_password = data.get('new_password')

    if not all([email, user_otp, new_password]):
        return jsonify({"error": "All fields are required."}), 400

    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Confirm recovery code matches token on file
            cursor.execute("SELECT otp FROM pending_otps WHERE email = %s", (email,))
            record = cursor.fetchone()

            if not record or record[0] != user_otp:
                return jsonify({"error": "Invalid or expired recovery token."}), 401

            # Hash replacement password
            salt = bcrypt.gensalt()
            password_hash = bcrypt.hashpw(new_password.encode('utf-8'), salt).decode('utf-8')

            # Update master system values
            cursor.execute("UPDATE users SET password_hash = %s WHERE email = %s", (password_hash, email))
            cursor.execute("DELETE FROM pending_otps WHERE email = %s", (email,))
            connection.commit()

            return jsonify({"message": "Password updated successfully!"}), 200

    except Exception as e:
        print(f"Reset Password Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if connection and connection.open:
            connection.close()

@auth_bp.route('/user/profile/<email>', methods=['GET'])
def get_user_profile(email):
    """Fetches user identity dimensions for the profile interface"""
    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = "SELECT name, roll_no AS rollNo, contact, email, chess_username AS chesscom, avatar FROM users WHERE email = %s"
            cursor.execute(sql, (email,))
            profile = cursor.fetchone()

            if not profile:
                return jsonify({"error": "Profile records not found."}), 404

            return jsonify(profile), 200

    except Exception as e:
        print(f"Profile Retrieval Failure: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if connection and connection.open:
            connection.close()


@auth_bp.route('/user/profile/update', methods=['PUT'])
def update_user_profile():
    """Applies modified user identity details to the persistent database layer, explicitly locking email and chess_username"""
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    roll_no = data.get('rollNo')
    contact = data.get('contact')
    avatar = data.get('avatar')

    # Security check: Email is our tracking identifier; it cannot be missing
    if not email:
        return jsonify({"error": "Tracking identity string is missing."}), 400

    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # REMOVED chess_username from the UPDATE statement to lock it down permanently
            sql = """
                UPDATE users 
                SET name = %s, roll_no = %s, contact = %s, avatar = %s 
                WHERE email = %s
            """
            cursor.execute(sql, (name, roll_no, contact, avatar, email))
            connection.commit()

            return jsonify({"message": "Profile metrics synced successfully!"}), 200

    except Exception as e:
        print(f"Profile Update Failure: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if connection and connection.open:
            connection.close()