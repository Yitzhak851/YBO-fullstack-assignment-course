from flask import Blueprint, jsonify
from app.extensions import db
from app.models.like import Like
from app.models.post import Post
from app.utils.security import login_required

like_bp = Blueprint("likes", __name__)

@like_bp.route("/post/<int:post_id>", methods=["POST"])
@login_required
def toggle_like(current_user, post_id):
    post = Post.query.get(post_id)

    if not post:
        return jsonify({"message": "Post not found"}), 404

    existing_like = Like.query.filter_by(
        user_id=current_user.id,
        post_id=post_id
    ).first()

    if existing_like:
        db.session.delete(existing_like)
        db.session.commit()
        return jsonify({"liked": False})

    like = Like(user_id=current_user.id, post_id=post_id)

    db.session.add(like)
    db.session.commit()

    return jsonify({"liked": True})