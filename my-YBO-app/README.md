# HW3 && HW4 : React + Vite Template

## HW3 : Add Home-page/Feed to my blog
At this assignment we need to create a home page for our blog, which will display a feed of posts from all users. The feed should show the title, email, and a preview of the post content (first 3 lines). Users should be able to click on a "Read more" button to expand the full text of the post. We will use Material UI (MUI) components to design the layout and styling of the feed.
1. Create new React project
2. Install Material UI
3. Create Top_Bar_Component:
     a. AppName on the left
     b. Menu buttons on the right
     c. use MUI AppBar and Toolbar to design
4. Create Single_Post_Componenty:
     a. Display title, email and first 3 lines
     b. Button Read more - should expand full text
     c. use MUI Card to design
5. Create api.js
     a. implement function to fetch posts
6. Create Feed_Component:
     a. at the start fetches 10 posts from all users and display them
     b. Load more - should fetch and display next 10 posts
     c. Display spinner when in progress
     d. use MUI Grid and Progress to design
Note:
At this assignment it should takes data from real backend. not from jsonplaceholder.

## HW4 : 
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
