document.addEventListener('DOMContentLoaded', function() {
    const body = document.querySelector("body"),
        sidebar = body.querySelector(".sidebar"),
        toggle = body.querySelector(".toggle"),
        profileLink = document.getElementById("profile-link"),
        friendsLink = document.getElementById("friends-link"),
        chatsLink = document.getElementById("chats-link"),
        profileScreen = document.getElementById("profile-screen"),
        friendsScreen = document.getElementById("friends-screen"),
        chatsScreen = document.getElementById("chats-screen");

    // // Debugging: Check if elements are found
    // console.log(profileLink); // Should log the profile link element
    // console.log(friendsLink); // Should log the friends link element
    // console.log(chatsLink); // Should log the chats link element

    // Toggle sidebar
    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    });

    // Show Profile Screen
    profileLink.addEventListener('click', function(event) {
        event.preventDefault();
        profileScreen.style.display = 'block';
        friendsScreen.style.display = 'none';
        chatsScreen.style.display = 'none';
    });

    // Show Friends Screen
    friendsLink.addEventListener('click', function(event) {
        event.preventDefault();
        profileScreen.style.display = 'none';
        friendsScreen.style.display = 'block';
        chatsScreen.style.display = 'none';
    });

    // Show Chats Screen
    chatsLink.addEventListener('click', function(event) {
        event.preventDefault();
        profileScreen.style.display = 'none';
        friendsScreen.style.display = 'none';
        chatsScreen.style.display = 'block';
    });
});