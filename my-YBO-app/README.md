# HW_03 && HW_04 : React + Vite Template
This assignment focuses on setting up a React application using Vite, a modern build tool that provides fast development and optimized production builds. The template includes essential configurations for React development, including support for JSX, HMR (Hot Module Replacement), and ESLint rules to ensure code quality.
We use templates to provide a starting point for your React application.
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
Currently, two official plugins are available:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

# Some Few mission TODO for me
- [x] Last Update: 11/05/26
1. Make Live demo for the project.
2. Add React Compiler to the project.
3. Make sure that the last commit works well by the HW-05 instructions and the project can be run without any error.

# How to Run the Application
1. Install dependencies: <br>
`npm install` <br>

2. Run Backend (the development server): <br>
`npm run dev`

3. Open your browser and navigate to <br>
`http://localhost:5173` <br>
to see the application running. <br>

# Project Structure
```text
my-YBO-app/
  │
  ├── index.html
  ├── package.json
  ├── README.md
  │
  ├── client / 
  │   │
  │   └── README.md
  │  
  ├── server / 
  │   │
  │   ├── server.js
  │   │
  │   ├── db/
  │   │  └── db.js
  │   │
  │   └── routes/
  │       └── authRoutes.js
  │       
  └──  src / 
     │
     ├── App.jsx
     ├── App.css
     ├── main.jsx
     ├── index.css
     │
     ├── api /
     │  └── api.js
     │
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
     │
     └── auth /
         ├── AuthContext.jsx
         └──  ProtectedRoute.jsx
```
