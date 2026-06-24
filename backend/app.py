import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load your local .env file BEFORE anything else
load_dotenv()

# Import your blueprints
from routes.auth import auth_bp

app = Flask(__name__)

# Allow your local React app to connect
CORS(
    app,
    origins=[
        "https://chess-club-iitk-myfork.vercel.app/"
    ]
)

app.register_blueprint(auth_bp, url_prefix='/api')

if __name__ == "__main__":
    # Local development settings with auto-reload enabled
    app.run(debug=True)


@app.route("/health")
def health():
    return {"status": "ok"}