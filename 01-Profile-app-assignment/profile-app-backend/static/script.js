// here i write the javascript code to fetch the profile data from the backend and display it on the frontend
// i will use the fetch API to get the data from the backend and then display it on the frontend
// function to fetch the profile data from the backend
async function fetchProfile() {
    try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const profileData = await response.json();
        displayProfile(profileData);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// function to display the profile data on the frontend
function displayProfile(profile) {
    const profileContainer = document.getElementById('profile-container');
    profileContainer.innerHTML = `
        <h2>${profile.name}</h2>
        <p><strong>Age:</strong> ${profile.age}</p>
        <p><strong>Email:</strong> ${profile.email}</p>
        <p><strong>Bio:</strong> ${profile.bio}</p>
    `;
}
// call the fetchProfile function when the page loads
window.onload = fetchProfile;
