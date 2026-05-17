<!-- THE FINAL PROJECT FOLDER -->

# This folder contain my FINAL PROJECT for course 3172

# Hot to run the project:
## How to run the project - backend: 
After cloning the repository, navigate to the project folder and follow these steps: <br>
into the backend folder: <br>
run the following commands: <br>
```python -m venv venv
``` 
and then activate the virtual environment: <br>
run into the terminal: 
at Windows: <br> 
```venv\Scripts\activate
``` 
the next command: <br> 
```pip install -r requirements.txt
```
than: <br> 
```python run.py
```
the server will start at :
http://localhost:5000

## How to run the project - frontend: 
run the following commands: <br>
into the frontend folder: <br>
```npm install
```
than: <br>
```npm run dev
than the frontend will start at :
http://localhost:5173



# STRUCTURE
runi-social-media-app/
│
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml
├── package.json
│
├── docs/
│   └── database-schema+api-spec+agents-design+deployment-aws.md
│
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── routes/
│       │   ├── AppRoutes.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── FeedPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── SearchPage.jsx
│       │   ├── CreatePostPage.jsx
│       │   ├── AdminDashboardPage.jsx
│       │   └── MessagesPage.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── PostCard.jsx
│       │   ├── PostList.jsx
│       │   ├── CommentSection.jsx
│       │   ├── LikeButton.jsx
│       │   ├── FollowButton.jsx
│       │   ├── RichTextEditor.jsx
│       │   ├── SearchBar.jsx
│       │   └── ReportButton.jsx
│       ├── api/
│       │   ├── authApi.js
│       │   ├── usersApi.js
│       │   ├── postsApi.js
│       │   ├── commentsApi.js
│       │   ├── likesApi.js
│       │   ├── reportsApi.js
│       │   ├── agentsApi.js
│       │   └── messagesApi.js
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── hooks/
│       │   ├── useAuth.js
│       │   ├── useInfiniteScroll.js
│       │   └── useDebounce.js
│       ├── utils/
│       │   ├── formatTimeAgo.js
│       │   └── validators.js
│       └── styles/
│           └── global.css
│
├── backend/
│   ├── requirements.txt
│   ├── run.py
│   ├── config.py
│   └── app/
│       ├── __init__.py
│       ├── extensions.py
│       ├── models/
│       │   ├── user.py
│       │   ├── post.py
│       │   ├── comment.py
│       │   ├── like.py
│       │   ├── follow.py
│       │   ├── report.py
│       │   ├── message.py
│       │   └── agent.py
│       ├── routes/
│       │   ├── auth_routes.py
│       │   ├── user_routes.py
│       │   ├── post_routes.py
│       │   ├── comment_routes.py
│       │   ├── like_routes.py
│       │   ├── follow_routes.py
│       │   ├── report_routes.py
│       │   ├── admin_routes.py
│       │   ├── agent_routes.py
│       │   └── message_routes.py
│       ├── services/
│       │   ├── auth_service.py
│       │   ├── email_service.py
│       │   ├── post_generation_service.py
│       │   ├── sentiment_service.py
│       │   ├── moderation_service.py
│       │   └── agent_service.py
│       ├── agents/
│       │   ├── agent_profiles.py
│       │   ├── agent_scheduler.py
│       │   └── agent_actions.py
│       ├── schemas/
│       │   ├── auth_schema.py
│       │   ├── user_schema.py
│       │   ├── post_schema.py
│       │   └── comment_schema.py
│       └── utils/
│           ├── security.py
│           ├── decorators.py
│           └── pagination.py
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── dbdiagram.dbml
│
├── tests/
│   ├── backend/
│   └── frontend/
│
└── deployment/
