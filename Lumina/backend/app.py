from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import re

app = Flask(__name__)
CORS(app)

USER_FILE = os.path.join(os.path.dirname(__file__), "users.json")

if not os.path.exists(USER_FILE):
    with open(USER_FILE, "w") as f:
        json.dump([], f)

def valid_email(email):
    pattern = r'^[^@\s]+@[^@\s]+\.[^@\s]+$'
    return re.match(pattern, email)

@app.route("/")
def home():
    return "Backend Running"

# -------- LOGIN --------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not valid_email(email):
        return jsonify({"success": False, "message": "Invalid Email Format"})

    with open(USER_FILE, "r") as f:
        users = json.load(f)

    for user in users:
        if user["email"] == email and user["password"] == password:
            return jsonify({"success": True, "message": "Login successful", "user": user})

    return jsonify({"success": False, "message": "Invalid credentials"})

# -------- REGISTER --------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name", "")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")  # "student" or "instructor"
    branch = data.get("branch", "General Studies")
    className = data.get("className", "Year 1")

    if not email or not password:
        return jsonify({"success": False, "message": "Email & Password required"})

    if not valid_email(email):
        return jsonify({"success": False, "message": "Invalid Email Format"})

    with open(USER_FILE, "r") as f:
        users = json.load(f)

    # prevent duplicate email
    for user in users:
        if user["email"] == email:
            return jsonify({"success": False, "message": "User Already Exists"})

    new_user = {
        "id": f"user-{len(users)+1}",
        "name": name,
        "email": email,
        "password": password,
        "role": role,
        "branch": branch,
        "className": className
    }

    users.append(new_user)

    with open(USER_FILE, "w") as f:
        json.dump(users, f, indent=4)

    return jsonify({"success": True, "message": "User Registered", "user": new_user})

if __name__ == "__main__":
    app.run(debug=True)
