import jwt
from datetime import datetime, timedelta
from flask import current_app, request, jsonify
from functools import wraps
from app.models.user import User

def generate_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=7)
    }

    return jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")

def get_current_user():
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return None

    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(
            token,
            current_app.config["SECRET_KEY"],
            algorithms=["HS256"]
        )
        return User.query.get(payload["user_id"])
    except Exception:
        return None

def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user = get_current_user()

        if not user:
            return jsonify({"message": "Unauthorized"}), 401

        return func(user, *args, **kwargs)

    return wrapper