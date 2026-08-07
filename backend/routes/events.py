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
    event_end_date = data.get('event_end_date') or None

    # Basic validation
    if not title or not event_type or not event_date or not event_time:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        query = """
            INSERT INTO events (
                title, event_type, short_description, event_briefing, 
                event_date, event_time, location, format, register_link, event_end_date
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cur.execute(query, (
            title, event_type, short_description, event_briefing, 
            event_date, event_time, location, format_type, register_link, event_end_date
        ))
        
        conn.commit()
        cur.close()
        conn.close()
        
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
        
        columns = [col[0] for col in cur.description]
        events_data = [dict(zip(columns, row)) for row in cur.fetchall()]
        
        cur.close()
        conn.close()
        
        return jsonify(events_data), 200

    except Exception as e:
        print(f"Error fetching events: {e}")
        return jsonify({"error": "Failed to fetch events"}), 500
    
@events_bp.route('/api/events/<int:event_id>', methods=['PUT', 'DELETE', 'OPTIONS'])
def modify_event(event_id):
    if request.method == 'OPTIONS':
        return jsonify({"message": "CORS preflight successful"}), 200

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        if request.method == 'DELETE':
            cur.execute("DELETE FROM events WHERE id = %s", (event_id,))
            conn.commit()
            return jsonify({"message": "Event deleted successfully!"}), 200

        if request.method == 'PUT':
            data = request.get_json()
            
            query = """
                UPDATE events 
                SET title=%s, event_type=%s, short_description=%s, event_briefing=%s, 
                    event_date=%s, event_time=%s, location=%s, format=%s, register_link=%s,
                    event_end_date=%s
                WHERE id = %s
            """
            cur.execute(query, (
                data.get('title'), data.get('event_type'), data.get('short_description'), 
                data.get('event_briefing'), data.get('event_date'), data.get('event_time'), 
                data.get('location'), data.get('format'), data.get('register_link'),
                data.get('event_end_date') or None,
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

@events_bp.route('/api/events/debug_log', methods=['POST'])
def debug_log():
    data = request.json
    log_msg = data.get('msg', '')
    print("BROWSER LOG:", log_msg)
    with open('browser_debug.log', 'a') as f:
        f.write(log_msg + '\n')
    return jsonify({"status": "ok"}), 200