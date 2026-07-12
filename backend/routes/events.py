from flask import Blueprint, request, jsonify
from flask_cors import CORS
from config.db import get_db_connection  # <--- 1. Add your custom import here


events_bp = Blueprint('events', __name__)
CORS(events_bp)

@events_bp.route('/api/events', methods=['POST'])
def create_event():
    data = request.get_json()
    
    title = data.get('title')
    event_type = data.get('event_type')
    short_description = data.get('short_description')
    event_briefing = data.get('event_briefing')
    event_date = data.get('event_date') 
    event_time = data.get('event_time')
    location = data.get('location')
    format_type = data.get('format')
    register_link = data.get('register_link')

    # Basic validation
    if not title or not event_type or not event_date or not event_time:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # 2. Use your custom connection function instead of 'mysql'
        conn = get_db_connection()
        cur = conn.cursor()
        
        query = """
            INSERT INTO events (
                title, event_type, short_description, event_briefing, 
                event_date, event_time, location, format, register_link
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cur.execute(query, (
            title, event_type, short_description, event_briefing, 
            event_date, event_time, location, format_type, register_link
        ))
        
        # 3. Commit and close using 'conn'
        conn.commit()
        cur.close()
        conn.close()  # Good practice to close the connection as well
        
        return jsonify({"message": "Event created successfully!"}), 201

    except Exception as e:
        print(f"Error inserting event: {e}")
        return jsonify({"error": "Database insertion failed"}), 500
    
@events_bp.route('/api/events', methods=['GET'])
def get_events():
    try:
        conn = get_db_connection()
        cur = conn.cursor() 
        
        cur.execute("SELECT * FROM events ORDER BY event_date ASC")
        
        # --- THE FIX IS HERE ---
        # 1. Grab the column names from the cursor
        columns = [col[0] for col in cur.description]
        
        # 2. Zip the column names with the rows to create a list of dictionaries
        events_data = [dict(zip(columns, row)) for row in cur.fetchall()]
        # -----------------------
        
        cur.close()
        conn.close()
        
        return jsonify(events_data), 200

    except Exception as e:
        print(f"Error fetching events: {e}")
        return jsonify({"error": "Failed to fetch events"}), 500
    
@events_bp.route('/api/events/<int:event_id>', methods=['PUT', 'DELETE', 'OPTIONS'])
def modify_event(event_id):
    # 1. Handle CORS Preflight
    if request.method == 'OPTIONS':
        return jsonify({"message": "CORS preflight successful"}), 200

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # 2. Handle DELETE Request
        if request.method == 'DELETE':
            cur.execute("DELETE FROM events WHERE id = %s", (event_id,))
            conn.commit()
            return jsonify({"message": "Event deleted successfully!"}), 200

        # 3. Handle PUT (Edit) Request
        if request.method == 'PUT':
            data = request.get_json()
            
            query = """
                UPDATE events 
                SET title=%s, event_type=%s, short_description=%s, event_briefing=%s, 
                    event_date=%s, event_time=%s, location=%s, format=%s, register_link=%s
                WHERE id = %s
            """
            cur.execute(query, (
                data.get('title'), data.get('event_type'), data.get('short_description'), 
                data.get('event_briefing'), data.get('event_date'), data.get('event_time'), 
                data.get('location'), data.get('format'), data.get('register_link'),
                event_id
            ))
            conn.commit()
            return jsonify({"message": "Event updated successfully!"}), 200

    except Exception as e:
        print(f"Error modifying event: {e}")
        return jsonify({"error": "Database operation failed"}), 500
    
    finally:
        cur.close()
        conn.close()