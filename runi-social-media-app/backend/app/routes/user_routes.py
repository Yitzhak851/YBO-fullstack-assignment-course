from flask import Blueprint, jsonify, request
from app.models.user import User
from app.models.post import Post
from app.models.follow import Follow
from app.utils.security import login_required

user_bp = Blueprint("users", __name__)

@user_bp.route("/search")
def search_users():
    query = request.args.get("q", "")

    users = User.query.filter(User.username.contains(query)).limit(10).all()

    return jsonify([user.to_dict() for user in users])

@user_bp.route("/<username>")
def get_profile(username):
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    posts = Post.query.filter_by(user_id=user.id).order_by(Post.created_at.desc()).all()

    followers_count = Follow.query.filter_by(following_id=user.id).count()
    following_count = Follow.query.filter_by(follower_id=user.id).count()

    return jsonify({
        "user": user.to_dict(),
        "posts": [post.to_dict() for post in posts],
        "followersCount": followers_count,
        "followingCount": following_count,
    })