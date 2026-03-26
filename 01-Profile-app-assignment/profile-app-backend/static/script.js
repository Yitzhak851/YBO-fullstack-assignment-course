const userSelect = document.getElementById('userSelect');
const loadBtn = document.getElementById('loadBtn');
const profileCard = document.getElementById('profileCard');
const loadingText = document.getElementById('loadingText');
const errorText = document.getElementById('errorText');

const profileImage = document.getElementById('profileImage');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileBio = document.getElementById('profileBio');
const postsList = document.getElementById('postsList');

async function loadProfile(userId) {
  loadingText.classList.remove('hidden');
  errorText.classList.add('hidden');
  profileCard.classList.add('hidden');

  try {
    const response = await fetch(`/api/profile/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();

    profileImage.src = data.picture;
    profileImage.alt = `${data.name} avatar`;
    profileName.textContent = data.name;
    profileEmail.textContent = data.email;
    profileBio.textContent = data.bio;

    postsList.innerHTML = '';
    data.posts.forEach(post => {
      const item = document.createElement('li');
      item.innerHTML = `
        <h4>${post.title}</h4>
        <p>${post.body}</p>
      `;
      postsList.appendChild(item);
    });

    profileCard.classList.remove('hidden');
  } catch (error) {
    errorText.classList.remove('hidden');
  } finally {
    loadingText.classList.add('hidden');
  }
}

loadBtn.addEventListener('click', () => {
  loadProfile(userSelect.value);
});

window.addEventListener('DOMContentLoaded', () => {
  loadProfile(userSelect.value);
});
