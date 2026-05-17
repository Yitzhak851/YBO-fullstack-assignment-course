from flask import Flask
from flask_cors import CORS

from config import Config
from app.extensions import db

from app.routes.auth_routes import auth_bp
from app.routes.user_routes import user_bp
from app.routes.post_routes import post_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(post_bp, url_prefix="/api/posts")

    @app.route("/")
    def home():
        return {"message": "RUNI Social Media API is running"}

    return app