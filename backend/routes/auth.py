import os
import random
import smtplib
from email.mime.text import MIMEText
from flask import Blueprint, request, jsonify
import bcrypt
import psycopg
from psycopg.rows import dict_row
import requests
from config.db import get_db_connection
from google.cloud import storage
from flask_jwt_extended import jwt_required, get_jwt_identity

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
    primary_email = data.get('email')
    secondary_email = data.get('secondary_email')

    if not primary_email or not primary_email.endswith('@iitk.ac.in'):
        return jsonify({"error": "You must use a valid @iitk.ac.in email address."}), 400
    
    if not primary_email or not secondary_email:
        return jsonify({"error": "Both primary and secondary emails are required."}), 400

    primary_otp = str(random.randint(100000, 999999))
    secondary_otp=str(random.randint(100000, 999999))

    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Check if user already exists
            cursor.execute("SELECT id FROM users WHERE email = %s", (primary_email,))
            if cursor.fetchone():
                return jsonify({"error": "This email is already registered."}), 409

            # Save/Renew temporary OTP record
            sql = """
                INSERT INTO pending_otps (email, otp) 
                VALUES (%s, %s) 
                ON CONFLICT (email) DO UPDATE SET otp = EXCLUDED.otp, created_at = CURRENT_TIMESTAMP
            """
            cursor.execute(sql, (primary_email, primary_otp))
            cursor.execute(sql, (secondary_email, secondary_otp))
            connection.commit()

        # print(f"\n--- [DEV TEST TOOL: OTP SECURITY DISPATCH] ---")
        # print(f"▸ PRIMARY OTP ({primary_email}): {primary_otp}")
        # print(f"▸ SECONDARY OTP ({secondary_email}): {secondary_otp}")
        # print(f"-----------------------------------------------\n")
        # return jsonify({"message": "OTPs sent successfully!"}), 200
        
        email_body_1 = f"Welcome to the Sanctum!\n\nYour verification code is: {primary_otp}\n\nUse this to complete your registration."
        email_body_2 = f"Welcome to the Sanctum!\n\nYour verification code is: {secondary_otp}\n\nUse this to complete your registration."
        primary_sent = send_custom_email(primary_email, 'Chess Club IITK - Verification Code', email_body_1)
        secondary_sent = send_custom_email(secondary_email, 'Chess Club IITK - Verification Code', email_body_2)
        if primary_sent and secondary_sent:
            return jsonify({"message": "OTPs sent successfully!"}), 200
        else:
            return jsonify({"error": "Failed to send email. Try again."}), 500

    except Exception as e:
        print(f"OTP Generation Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if connection:
            connection.close()


@auth_bp.route('/verify-register', methods=['POST'])
def verify_and_register():
    data = request.get_json()
    email = data.get('email')
    secondary_email = data.get('secondary_email')
    primary_user_otp = data.get('primary_otp')
    secondary_user_otp = data.get('secondary_otp')
    password = data.get('password')
    chess_username = data.get('chess_username')
    name = data.get('name')
    roll_no = data.get('rollNo')
    contact = data.get('contact')

    if not all([email, secondary_email, primary_user_otp, secondary_user_otp, password, chess_username, name, roll_no, contact]):
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
            p_record = cursor.fetchone()

            if not p_record or p_record[0] != primary_user_otp:
                return jsonify({"error": "Invalid or expired primary email confirmation OTP."}), 401
            
            cursor.execute("SELECT otp FROM pending_otps WHERE email = %s", (secondary_email,))
            s_record = cursor.fetchone()

            if not s_record or s_record[0] != secondary_user_otp:
                return jsonify({"error": "Invalid or expired secondary email confirmation OTP."}), 401

            # 3. Hash secret credentials safely
            salt = bcrypt.gensalt()
            password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
            
            cursor.execute(
                "INSERT INTO users (email, chess_username, password_hash, name, roll_no, contact, secondary_email) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (email, chess_username, password_hash, name, roll_no, contact, secondary_email)
            )
            
            # 4. Clean up transient database entries
            cursor.execute("DELETE FROM pending_otps WHERE email IN (%s, %s)", (email, secondary_email))
            connection.commit()
            
            return jsonify({"message": "Account created successfully!"}), 201

    except Exception as e:
        print(f"Registration Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if connection:
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
                ON CONFLICT (email) DO UPDATE SET otp = EXCLUDED.otp, created_at = CURRENT_TIMESTAMP
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
        if connection:
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
        if connection:
            connection.close()

@auth_bp.route('/user/profile/<email>', methods=['GET'])
@jwt_required()
def get_user_profile(email):
    #Extract true identity from jwt
    current_authenticated_user=get_jwt_identity()
    #Cross-reference them
    if current_authenticated_user!=email:
        return jsonify({"error": "Unauthorized cross-profile read blocked"}), 403
    """Fetches user identity dimensions for the profile interface"""
    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor(row_factory=dict_row) as cursor:
            sql = "SELECT name, roll_no AS rollNo, contact, email, chess_username AS chesscom, avatar, secondary_email FROM users WHERE email = %s"
            cursor.execute(sql, (email,))
            profile = cursor.fetchone()

            if not profile:
                return jsonify({"error": "Profile records not found."}), 404

            return jsonify(profile), 200

    except Exception as e:
        print(f"Profile Retrieval Failure: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if connection:
            connection.close()


@auth_bp.route('/user/profile/update', methods=['PUT'])
@jwt_required()

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

    current_authenticated_user=get_jwt_identity()
    if current_authenticated_user!=email:
        return jsonify({"error": "Unauthorized cross-profile modifications blocked"}), 403
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
        if connection:
            connection.close()

# --- DELETE REQUEST ---
@auth_bp.route('/user/profile/delete', methods=['DELETE'])
@jwt_required()
def delete_user_account():
    """Verifies user password and purges their account profile permanently from the database"""
    data = request.get_json()
    password = data.get('password')
    email = data.get('email')

    if not password or not email:
        return jsonify({"error": "Password and identity verification strings are required."}), 400

    # Safety Guard: Ensure the user is deleting their OWN account, not someone else's
    current_authenticated_user = get_jwt_identity()
    if current_authenticated_user != email:
        return jsonify({"error": "Unauthorized cross-profile deletion attack blocked."}), 403

    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # 1. Fetch the user's password hash from the database
            cursor.execute("SELECT password_hash FROM users WHERE email = %s", (email,))
            user_record = cursor.fetchone()

            if not user_record:
                return jsonify({"error": "Account records not found."}), 404

            # 2. Check if the input password matches the stored hash
            if not bcrypt.checkpw(password.encode('utf-8'), user_record[0].encode('utf-8')):
                return jsonify({"error": "Incorrect password. Deletion aborted."}), 401

            # 3. Purge the user from the users master data grid
            cursor.execute("DELETE FROM users WHERE email = %s", (email,))
            
            # (Optional) Clean up any dangling pending OTP records for this email
            cursor.execute("DELETE FROM pending_otps WHERE email = %s", (email,))
            
            connection.commit()
            return jsonify({"message": "Account purged successfully."}), 200

    except Exception as e:
        print(f"Critical Account Deletion Error: {e}")
        return jsonify({"error": "Internal server error during account erasure."}), 500
    finally:
        if connection:
            connection.close()

# --- LEAGUE OF LEGENDS 6.0 EVENT REGISTRATION ---

@auth_bp.route('/register-lol', methods=['POST'])
@jwt_required()
def register_lol():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    roll_no = data.get('roll_no')
    chess_username = data.get('chess_username')
    contact = data.get('contact')
    secondary_email = data.get('secondary_email')

    if not all([email, name, roll_no, chess_username, contact]):
        return jsonify({"error": "All fields are required."}), 400

    current_user_email = get_jwt_identity()
    if current_user_email != email:
        return jsonify({"error": "Unauthorized registration identity mismatch."}), 403

    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Check if user is already registered
            cursor.execute('SELECT id FROM "lolEntries" WHERE email = %s', (email,))
            if cursor.fetchone():
                return jsonify({"error": "You are already registered for this event."}), 409

            # Insert registration record
            cursor.execute(
                'INSERT INTO "lolEntries" (email, name, roll_no, chess_username, contact, secondary_email) VALUES (%s, %s, %s, %s, %s, %s)',
                (email, name, roll_no, chess_username, contact, secondary_email or '')
            )
            connection.commit()
            return jsonify({"message": "Successfully registered for League of Legends 6.0!"}), 201

    except Exception as e:
        print(f"LoL Registration Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if connection:
            connection.close()

@auth_bp.route('/register-lol/status', methods=['GET'])
@jwt_required()
def register_lol_status():
    email = get_jwt_identity()
    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute('SELECT id FROM "lolEntries" WHERE email = %s', (email,))
            is_registered = cursor.fetchone() is not None
            return jsonify({"is_registered": is_registered}), 200
    except Exception as e:
        print(f"LoL Registration Status Error: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        if connection:
            connection.close()