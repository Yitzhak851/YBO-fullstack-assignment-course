# General instuction's
The final project is to create a social media site,<br>
similar to instagram.

## Requirements- local setup: 
We need to create a full stack application with a React frontend and Node.js backend. <br>
The backend will handle user authentication, profile management, post creation, and feed aggregation. <br>

### a. User Authentication 
i. User sign-up, login, and logout 
ii. Secure password storage / hashing 
### b. User Profiles
     a dedicated page for each user displaying their name, bio, profile picture, and a list of their specific posts. 
### c. Social Interactions:
i. Search Functionality: A search bar to find other users by username. 
ii. Follow/Unfollow: Establishing relationships between user accounts. Present the “following” and “followers” in the user profile page. 
iii. Timestamping: All posts must show "time ago" (e.g., 2 hours ago) instead of a raw date. 
### d. The Feed - a dedicated page that aggregates posts 
i. From all users (global feed) 
ii. From people the user follows (individual feed) 
iii. Infinite Scroll / Pagination: Instead of loading all posts at once, implement "Lazy Loading" where more posts load as the user scrolls down. 
### e. Post Creation - ability to create a post (text and image). 
i. Rich Text Editor: Implementing a "WYSIWYG" editor so users can add bold, italics, and hyperlinks to their posts. 
### f. Database Schema 
i. students must submit a diagram of their database (SQL or NoSQL) showing how the different entities relate to each other. 
