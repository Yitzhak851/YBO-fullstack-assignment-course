# Flask app to serve a user profile page with data from JSONPlaceholder API.
from flask import Flask, render_template, jsonify 
# requests is used to make HTTP requests to the JSONPlaceholder API to fetch user and post data.
import requests

# Init the Flask application
app = Flask(__name__)

# Base URL for the JSONPlaceholder API => provides fake data for testing and prototyping
JSONPLACEHOLDER_URL = "https://jsonplaceholder.typicode.com"

# Route for the home page, which renders the index.html template
@app.route("/")
def home():
    return render_template("index.html")

# API route to fetch the user profile data, including user info and their posts
@app.route("/api/profile")
def get_profile():
    user_id = 2
    # Make 2 API call to JSONPlaceholder: 1) toget user info 2) toget the user's posts
    try:
        user_response = requests.get(
            f"{JSONPLACEHOLDER_URL}/users/{user_id}",
            timeout=10
        )

        posts_response = requests.get(
            f"{JSONPLACEHOLDER_URL}/posts?userId={user_id}",
            timeout=10
        )

        user_response.raise_for_status()
        posts_response.raise_for_status()

        user = user_response.json()
        posts = posts_response.json()

        profile = {
            "name": user["name"],
            "username": user["username"],
            "email": user["email"],
            "bio": user["company"]["catchPhrase"],
            "picture": f"https://api.dicebear.com/9.x/adventurer/svg?seed={user['username']}",
            "posts": posts[:2]
        }

        return jsonify(profile)

    except Exception as error:
        return jsonify({
            "error": "Failed to load data",
            "details": str(error)
        }), 500

# Run the Flask app in debug mode => provides detailed error messages && auto-reloads the server on code changes
if __name__ == "__main__":
    app.run(debug=True)