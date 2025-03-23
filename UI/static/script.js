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

document.addEventListener("DOMContentLoaded", function () {
    fetch('/get_friends')
        .then(response => response.json())
        .then(friends => {
            const container = document.getElementById('friends-list-container');
            container.innerHTML = ""; // Clear any existing content
            
            if (friends.error) {
                container.innerHTML = `<p>${friends.error}</p>`;
            } else {
                friends.forEach(friend => {
                    const friendElement = document.createElement('a');
                    friendElement.href = "#";
                    friendElement.setAttribute('data-id', friend.id); // Add friend ID
                    friendElement.classList.add('friend-item');
                    friendElement.innerHTML = `
                        <div class="content">
                            <img src="${friend.profile_pic}" alt="">
                            <div class="details">
                                <span>${friend.username}</span>
                            </div>
                        </div>
                        <div class="messages-dot">
                            <i class='bx bxs-circle'></i>
                        </div>
                    `;
                    container.appendChild(friendElement);
                });
            }
        })
        .catch(err => {
            console.error("Error fetching friends:", err);
            document.getElementById('friends-list-container').innerHTML = `<p>Unable to load friends.</p>`;
        });
});


document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById('friends-list-container');
    const chatBox = document.querySelector('.chat-box'); // Container for displaying messages

    // Delegate click events to the container
    container.addEventListener('click', function (e) {
        const friendItem = e.target.closest('.friend-item');
        if (!friendItem) return; // Click outside friend items

        const friendId = friendItem.getAttribute('data-id');

        // Fetch messages with this friend
        fetch(`/get_messages/${friendId}`)  //http get request
            .then(response => response.json())
            .then(messages => {
                chatBox.innerHTML = ""; // Clear previous chat

                if (messages.error) {
                    chatBox.innerHTML = `<p>${messages.error}</p>`;
                } else 
                {
                    if (messages.length === 0) {
                        chatBox.innerHTML = `<p>No messages in this chat yet.</p>`;
                    } else
                    {
                        messages.forEach(msg => {
                            const messageElement = document.createElement('div');
                            messageElement.classList.add('chat', msg.is_outgoing ? 'outgoing' : 'incoming');
                            messageElement.innerHTML = `
                                <div class="details">
                                    <p>${msg.content}</p>
                                    <span class="timestamp">${msg.timestamp}</span>
                                </div>
                            `;
                            chatBox.appendChild(messageElement);
                        });
                    }
                    const messageElement = document.createElement('div');
                    messageElement.innerHTML = `
                    <div action="#" class="typing-area">
                          
                                    <input type="text" name="message" class="input-field" placeholder="Type a message here..." autocomplete="off">
                                    <button><i class='bx bxl-telegram'></i></button>
                                 </div>  `;
                    chatBox.appendChild(messageElement);

                }
            })
            .catch(err => {
                console.error("Error fetching messages:", err);
                chatBox.innerHTML = `<p>Unable to load messages.</p>`;
            });
    });
});

