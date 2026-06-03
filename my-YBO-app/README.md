# My YBO Blog Application
This is a simple blog application built using React for the frontend and Node.js <br>
With 'Express' technology for the backend. <br>
The application allows users to create, view, and manage blog posts. <br>
Users can sign up, log in, and create new posts. <br>
The application also includes a feed page where users can see all the posts. <br>

## Step-by-step : HW3 : Add Home-page/Feed to my blog
... (to be added)

## Step-by-step : HW4 : 
... (to be added)

# Some Few mission TODO for me
- [x] Last Update: 11/05/26
1. Make Live demo for the project.
2. Add React Compiler to the project.
3. Make sure that the last commit works well by the HW-05 instructions and the project can be run without any error.

# How to Run the Application
1. Install dependencies: <br>
`npm install` <br>

2. Run Backend (the development server): <br>
`cd ~\my-YBO-app\server` <br>
then run at this path: <br>
`npm run dev`

3. Open your browser and navigate to <br>
`http://localhost:5173` <br>
to see the application running. <br>
and open  browser and navigate to <br>
`http://localhost:5000/api/posts` <br>
to see the posts data from the backend. <br>

# Project Structure
```text
my-YBO-app/
  │
  ├── index.html
  ├── package.json
  ├── README.md
  ├── server / 
  │   ├── server.js
  │   ├── db/
  │   │  └── db.js
  │   └── routes/
  │       └── authRoutes.js
  └──  src / 
     ├── App.jsx
     ├── App.css
     ├── main.jsx
     ├── index.css
     ├── api /
     │  └── api.js
     ├── components /
     │  ├── Feed.jsx
     │  ├── Login.jsx
     │  ├── NewPost.jsx
     │  ├── Search.jsx
     │  ├── Signup.jsx
     │  ├── SinglePost.jsx
     │  ├── ToolbarComponent.jsx
     │  ├── User.jsx
     │  └──  Users.jsx  
     └── auth /
         ├── AuthContext.jsx
         └──  ProtectedRoute.jsx
```
