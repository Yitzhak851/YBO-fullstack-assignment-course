# here i write the code for the backend of the profile app assignment
# like we so at 00-General-files/demo-lecture-01/runi-demos/weather-demo-backend/app.py
from flask import Flask, request, jsonify, redirect 

app = Flask(__name__, static_folder="static")

@app.route("/")
def index():
    return redirect("/static/index.html")   

@app.route("/api/profile", methods=["POST"])
def create_profile():
    data = request.get_json()
    name = data.get("name")
    age = data.get("age")
    bio = data.get("bio")

    if not name or not age or not bio:
        return jsonify({"error": "Missing required fields"}), 400

    profile = {
        "name": name,
        "age": age,
        "bio": bio
    }

    return jsonify(profile), 201

if __name__ == "__main__":
    app.run(debug=True)
    # we can run the app using the command "python app.py" in the terminal

# this code creates a simple Flask backend for the profile app assignment. 
# It has one endpoint "/api/profile" that accepts POST requests with a JSON body containing 
# the name, age, and bio of the profile. The endpoint validates the input and returns the created profile as a JSON response.

