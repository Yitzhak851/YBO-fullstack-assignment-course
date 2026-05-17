from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.comment import Comment
from app.models.post import Post
from app.utils.security import login_required

comment_bp = Blueprint("comments", __name__)

@comment_bp.route("/post/<int:post_id>", methods=["GET"])
def get_comments(post_id):
    comments = Comment.query.filter_by(post_id=post_id).all()
    return jsonify([comment.to_dict() for comment in comments])

@comment_bp.route("/post/<int:post_id>", methods=["POST"])
@login_required
def add_comment(current_user, post_id):
    post = Post.query.get(post_id)

    if not post:
        return jsonify({"message": "Post not found"}), 404

    data = request.get_json()
    content = data.get("content")

    if not content:
        return jsonify({"message": "Comment content is required"}), 400

    comment = Comment(
        content=content,
        user_id=current_user.id,
        post_id=post_id
    )

    db.session.add(comment)
    db.session.commit()

    return jsonify(comment.to_dict()), 201