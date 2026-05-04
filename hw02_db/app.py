# Create Database and Table
from flask import Flask, render_template, request, redirect, url_for
# MySQL Connector for Python
import mysql.connector
# Error handling for MySQL operations
from mysql.connector import Error

# Initialize Flask app
app = Flask(__name__)

# Database configuration
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "X0f2qq64g@@",
    "database": "blog_db"
}

# fofo to establish a database connection
def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)


# Route for the home page
@app.route("/")
# fofo to display the home page with a list of users
def index():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id, name, email FROM users ORDER BY id")
    users = cursor.fetchall()

    cursor.close()
    conn.close()

    return render_template("index.html", users=users)


# Route for creating a new post
@app.route("/create-post", methods=["GET", "POST"])
# fofo to handle the creation of a new post
def create_post():
    message = None

    if request.method == "POST":
        title = request.form.get("title")
        body = request.form.get("body")
        email = request.form.get("email")

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user is None:
            message = "User with this email does not exist."
        else:
            cursor.execute(
                """
                INSERT INTO posts (author_id, title, body)
                VALUES (%s, %s, %s)
                """,
                (user["id"], title, body)
            )
            conn.commit()
            cursor.close()
            conn.close()
            return redirect(url_for("global_feed"))

        cursor.close()
        conn.close()

    return render_template("create_post.html", message=message)


# Route for displaying the global feed of posts
@app.route("/global-feed")
# fofo to display all posts in the global feed, showing the post title, body, and author information
def global_feed():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT 
            posts.id,
            posts.title,
            posts.body,
            users.id AS user_id,
            users.name,
            users.email
        FROM posts
        JOIN users ON posts.author_id = users.id
        ORDER BY posts.id DESC
        """
    )

    posts = cursor.fetchall()

    cursor.close()
    conn.close()

    return render_template("global_feed.html", posts=posts)


# Route for displaying posts by a specific user
@app.route("/user-posts", methods=["GET", "POST"])
# fofo to display posts by a specific user based on their email, showing the post title, body, and author information
def user_posts():
    posts = []
    searched_email = None
    message = None

    if request.method == "POST":
        searched_email = request.form.get("email")

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id, name, email FROM users WHERE email = %s", (searched_email,))
        user = cursor.fetchone()

        if user is None:
            message = "User not found."
        else:
            cursor.execute(
                """
                SELECT 
                    posts.id,
                    posts.title,
                    posts.body,
                    users.name,
                    users.email
                FROM posts
                JOIN users ON posts.author_id = users.id
                WHERE users.email = %s
                ORDER BY posts.id DESC
                """,
                (searched_email,)
            )
            posts = cursor.fetchall()

        cursor.close()
        conn.close()

    return render_template(
        "user_posts.html",
        posts=posts,
        searched_email=searched_email,
        message=message
    )


# Route for searching users by name or email
@app.route("/search-user", methods=["GET", "POST"])
# fofo to search for users by their name or email, displaying the matching users in a list
def search_user():
    users = []
    search_text = None

    if request.method == "POST":
        search_text = request.form.get("search")

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, name, email
            FROM users
            WHERE name LIKE %s OR email LIKE %s
            ORDER BY id
            """,
            (f"%{search_text}%", f"%{search_text}%")
        )

        users = cursor.fetchall()

        cursor.close()
        conn.close()

    return render_template("search_user.html", users=users, search_text=search_text)


# Route for displaying a user's profile and their posts
@app.route("/profile/<int:user_id>")
# fofo to display a user's profile based on their user ID, showing their name, email, and a list of their posts
def profile(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id, name, email FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user is None:
        return "User not found", 404

    return render_template("index.html", users=[user], selected_user=user)


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)