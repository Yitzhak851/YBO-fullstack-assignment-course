from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.post import Post
from app.models.follow import Follow
from app.utils.security import login_required

post_bp = Blueprint("posts", __name__)

@post_bp.route("", methods=["GET"])
@login_required
def get_global_feed(current_user):
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))

    posts = (
        Post.query
        .order_by(Post.created_at.desc())
        .paginate(page=page, per_page=limit, error_out=False)
    )

    return jsonify({
        "items": [post.to_dict() for post in posts.items],
        "page": page,
        "hasNext": posts.has_next
    })

@post_bp.route("/following", methods=["GET"])
@login_required
def get_following_feed(current_user):
    followed_ids = [
        follow.following_id
        for follow in Follow.query.filter_by(follower_id=current_user.id).all()
    ]

    posts = (
        Post.query
        .filter(Post.user_id.in_(followed_ids))
        .order_by(Post.created_at.desc())
        .all()
    )

    return jsonify([post.to_dict() for post in posts])

@post_bp.route("", methods=["POST"])
@login_required
def create_post(current_user):
    data = request.get_json()

    content = data.get("content")
    image_url = data.get("imageUrl", "")

    if not content:
        return jsonify({"message": "Post content is required"}), 400

    post = Post(
        content=content,
        image_url=image_url,
        user_id=current_user.id
    )

    db.session.add(post)
    db.session.commit()

    return jsonify(post.to_dict()), 201