import os
import psycopg

def get_db_connection():
    # PostgreSQL / Supabase Connection (TCP)
    conn = psycopg.connect(
        host=os.environ.get('DB_HOST', '127.0.0.1'),
        port=int(os.environ.get('DB_PORT', 5432)),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        dbname=os.environ.get('DB_NAME'),  # <-- Changed 'database' to 'dbname'
        sslmode=os.environ.get('DB_SSLMODE', 'require')
    )
    conn.autocommit = True
    return conn
