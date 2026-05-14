# Create Database and Table (HW-02)
This is a small full-stack web application built for a Full Stack course assignment. 
The app displays a user profile, including: Name, Email, Avatar, and a list of posts created by the user.

# How to Run the Application
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Create a virtual environment and activate it.
4. Install the required dependencies using `pip install -r requirements.txt`.
5. Set up your MySQL database and tables as per the instructions.
6. Run the Flask application using `python app.py`.
7. Open your web browser and go to `http://localhost:5000` to view the user profile web app and access the various features implemented in this assignment.

# This folder contain Assignment Number 02
This assignment is a small full-stack web application built for a Full Stack course assignment. 
The app displays a user profile, including:
<br> This is the assignment from week number 02

# Instructions for this assignment:
Design a schema of your database using an [https://dbdiagram.io/](https://dbdiagram.io/) and implement it using MySQL. <br>
Install MySQL locally [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/) <br>
Install MySQL connector for Python: 
```text
pip3 install mysql-connector-python
```
Create your database and tables through the mysql CLI <br>
Install Postman [https://www.postman.com/] (https://www.postman.com/) <br>
Implement the following tables: <br>
users (id, name, email), <br>
posts (id, author_id, title, body). <br>
Implement a page to create new posts with fields: <br>
title, body, author (email). <br>
Implement a page to see all posts (global feed). <br>
Implement a page to see posts from a specific user. <br>
Connect with HW1: <br>
- Update the profile page to use database data for existing fields 
- And external services for everything else
- Implement a page to search for user profiles.

## Technologies Used
- Python
- Flask
- MySQL
- HTML
- CSS
- JavaScript


## APIs Used
- JSONPlaceholder - fake users and posts
- DiceBear - cartoon avatar illustrations

## Project Structure
```text
HW-02/
│
├── app.py
├── requirements.txt
├── README.md
│
├── /static
│   ├── style.css
│   └── script.js
│
└── /templates
    ├── index.html
    ├── create_post.html
    ├── global_feed.html
    ├── user_posts.html
    └── search_user.html    
```




<!-- ## Live Demo

You can view the live project here:
[Click here to open the app](https://ybo-fullstack-assignment-course-q4do-lqoluiech.vercel.app) -->
