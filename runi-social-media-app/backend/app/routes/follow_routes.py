from flask import Blueprint, jsonify
from app.extensions import db
from app.models.user import User
from app.models.follow import Follow
from app.utils.security import login_required

follow_bp = Blueprint("follows", __name__)

@follow_bp.route("/<int:user_id>", methods=["POST"])
@login_required
def toggle_follow(current_user, user_id):
    if current_user.id == user_id:
        return jsonify({"message": "You cannot follow yourself"}), 400

    target_user = User.query.get(user_id)

    if not target_user:
        return jsonify({"message": "User not found"}), 404

    existing_follow = Follow.query.filter_by(
        follower_id=current_user.id,
        following_id=user_id
    ).first()

    if existing_follow:
        db.session.delete(existing_follow)
        db.session.commit()
        return jsonify({"following": False})

    follow = Follow(
        follower_id=current_user.id,
        following_id=user_id
    )

    db.session.add(follow)
    db.session.commit()

    return jsonify({"following": True})