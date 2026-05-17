from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
from app.utils.security import generate_token, login_required

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not username or not email or not password or not name:
        return jsonify({"message": "Missing required fields"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 409

    user = User(
        username=username,
        email=email,
        name=name,
        bio="",
        profile_picture=""
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id)

    return jsonify({
        "token": token,
        "user": user.to_dict()
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid email or password"}), 401

    token = generate_token(user.id)

    return jsonify({
        "token": token,
        "user": user.to_dict()
    })

@auth_bp.route("/me", methods=["GET"])
@login_required
def me(current_user):
    return jsonify(current_user.to_dict())