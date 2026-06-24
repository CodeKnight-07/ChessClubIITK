import os
import pymysql

def get_db_connection():
    # Pure local development connection
    return pymysql.connect(
        unix_socket=f"/cloudsql/{os.environ.get('INSTANCE_CONNECTION_NAME')}",
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        db=os.environ.get('DB_NAME'),
        autocommit=True
    )