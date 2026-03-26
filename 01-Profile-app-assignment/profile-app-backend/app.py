from flask import Flask, jsonify, render_template
import requests

app = Flask(__name__)

JSONPLACEHOLDER_BASE = "https://jsonplaceholder.typicode.com"
DICEBEAR_BASE = "https://api.dicebear.com/9.x/personas/svg"


def fetch_json(url: str):
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.json()


def build_avatar_url(name: str) -> str:
    seed = name.replace(" ", "-")
    return f"{DICEBEAR_BASE}?seed={seed}&backgroundColor=b6e3f4,c0aede,d1d4f9"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/profile/<int:user_id>")
def profile(user_id: int):
    user = fetch_json(f"{JSONPLACEHOLDER_BASE}/users/{user_id}")
    posts = fetch_json(f"{JSONPLACEHOLDER_BASE}/posts?userId={user_id}")

    profile_data = {
        "id": user["id"],
        "name": user["name"],
        "picture": build_avatar_url(user["name"]),
        "email": user["email"],
        "bio": (
            f"Hi, I'm {user['name']} from {user['address']['city']}. "
            f"I work at {user['company']['name']} and you can reach me at {user['email']}."
        ),
        "posts": posts,
    }
    return jsonify(profile_data)


if __name__ == "__main__":
    app.run(debug=True)
