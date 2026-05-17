from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    password_hash = db.Column(db.String(255), nullable=False)

    name = db.Column(db.String(120), nullable=False)
    bio = db.Column(db.Text, default="")
    profile_picture = db.Column(db.String(255), default="")

    is_admin = db.Column(db.Boolean, default=False)
    is_agent = db.Column(db.Boolean, default=False)
    agent_personality = db.Column(db.String(255), default="")

    posts = db.relationship("Post", backref="author", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "name": self.name,
            "bio": self.bio,
            "profilePicture": self.profile_picture,
            "isAdmin": self.is_admin,
            "isAgent": self.is_agent,
            "agentPersonality": self.agent_personality,
        }