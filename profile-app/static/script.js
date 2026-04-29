async function loadProfile() {
    try {
        const response = await fetch("/api/profile");

        if (!response.ok) {
            throw new Error("Server error");
        }

        const user = await response.json();

        document.getElementById("profilePicture").src = user.picture;
        document.getElementById("userName").textContent = user.name;
        document.getElementById("userUsername").textContent = user.username;
        document.getElementById("userEmail").textContent = user.email;
        document.getElementById("userBio").textContent = user.bio;

        const postsContainer = document.getElementById("postsContainer");
        postsContainer.innerHTML = "";

        user.posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.className = "post";

            postElement.innerHTML = `
                <h4 class="post-title">${post.title}</h4>
                <p class="post-body">${post.body}</p>
            `;

            postsContainer.appendChild(postElement);
        });

    } catch (error) {
        console.error(error);
        document.getElementById("userName").textContent = "Failed to load profile";
    }
}

loadProfile();