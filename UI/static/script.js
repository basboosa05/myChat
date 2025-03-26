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


// document.addEventListener("DOMContentLoaded", function () {
//     const container = document.getElementById('friends-list-container');
//     const chatBox = document.querySelector('.chat-box'); // Container for displaying messages

//     // Delegate click events to the container
//     container.addEventListener('click', function (e) {
//         const friendItem = e.target.closest('.friend-item');
//         if (!friendItem) return; // Click outside friend items

//         const friendId = friendItem.getAttribute('data-id');

//         // Fetch messages with this friend
//         fetch(`/get_messages/${friendId}`)  //http get request
//             .then(response => response.json())
//             .then(messages => {
//                 chatBox.innerHTML = ""; // Clear previous chat

//                 if (messages.error) {
//                     chatBox.innerHTML = `<p>${messages.error}</p>`;
//                 } else 
//                 {
//                     if (messages.length === 0) {
//                         chatBox.innerHTML = `<p>No messages in this chat yet.</p>`;
//                     } else
//                     {
//                         messages.forEach(msg => {
//                             const messageElement = document.createElement('div');
//                             messageElement.classList.add('chat', msg.is_outgoing ? 'outgoing' : 'incoming');
//                             messageElement.innerHTML = `
//                                 <div class="details">
//                                     <p>${msg.content}</p>
//                                     <span class="timestamp">${msg.timestamp}</span>
//                                 </div>
//                             `;
//                             chatBox.appendChild(messageElement);
//                         });
//                     }
//                     const messageElement = document.createElement('div');
//                     messageElement.innerHTML = `
//                     <div action="#" class="typing-area">
                          
//                                     <input type="text" name="message" class="input-field" placeholder="Type a message here..." autocomplete="off">
//                                     <button><i class='bx bxl-telegram'></i></button>
//                                  </div>  `;
//                     chatBox.appendChild(messageElement);

//                 }
//             })
//             .catch(err => {
//                 console.error("Error fetching messages:", err);
//                 chatBox.innerHTML = `<p>Unable to load messages.</p>`;
//             });
//     });
// });


document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById('friends-list-container');
    const chatBox = document.querySelector('.chat-box'); // Container for displaying messages
    let currentFriendId = null; // This will store the current chat friend ID
    const socket = io.connect('http://127.0.0.1:5000'); 

    // Listen for incoming messages from the server
    socket.on('new_message', function (msg) {
        // Determine conversation partner's id.
        let conversationPartnerId;
        if (msg.sender_id === window.myUserId) {
            conversationPartnerId = msg.receiver_id;
        } else {
            conversationPartnerId = msg.sender_id;
        }
    
        // Only update the chat if the new message belongs to the currently open conversation:
        if (currentFriendId && parseInt(currentFriendId) === conversationPartnerId) {
            // Determine whether this message is outgoing:
            const isOutgoing = (msg.sender_id === window.myUserId);
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat', isOutgoing ? 'outgoing' : 'incoming');
            messageElement.innerHTML = `
                <div class="details">
                    <p>${msg.content}</p>
                    <span class="timestamp">${msg.timestamp}</span>
                </div>
            `;
            // Insert the new message before the typing area
            const typingArea = chatBox.querySelector('.typing-area');
            chatBox.insertBefore(messageElement, typingArea);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    });
    
    // Delegate click events to the friends list container
    container.addEventListener('click', function (e) {
        const friendItem = e.target.closest('.friend-item');
        if (!friendItem) return; // Exit if click is outside friend items
        // Save the friend ID from the data-id attribute
        currentFriendId = friendItem.getAttribute('data-id');
        // Fetch messages for this friend
        fetchMessages(currentFriendId);
    });

    // Fetch messages for a given friend ID
    function fetchMessages(friendId) {
        fetch(`/get_messages/${friendId}`)
            .then(response => response.json())
            .then(messages => {
                chatBox.innerHTML = ""; // Clear previous chat messages

                if (messages.error) {
                    chatBox.innerHTML = `<p>${messages.error}</p>`;
                } else {
                    // If no messages exist, show a placeholder message
                    if (messages.length === 0) {
                        chatBox.innerHTML = `<p>No messages in this chat yet.</p>`;
                    } else {
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
                    // Append the typing area to the chat box below the messages
                    appendTypingArea();
                }
            })
            .catch(err => {
                console.error("Error fetching messages:", err);
                chatBox.innerHTML = `<p>Unable to load messages.</p>`;
            });
    }

    // Append the typing area to the chat box (if not already added)
    function appendTypingArea() {
        console.log("appendTypingArea called"); 
        let typingArea = chatBox.querySelector(".typing-area");
        if (!typingArea) {
            typingArea = document.createElement("div");
            typingArea.classList.add("typing-area");
            typingArea.innerHTML = `
                <input type="text" name="message" class="input-field" placeholder="Type a message here..." autocomplete="off">
                <button class="send-btn"><i class='bx bxl-telegram'></i></button>
            `;
            chatBox.appendChild(typingArea);
            
            // Attach event listener to the send button
            const sendButton = typingArea.querySelector(".send-btn");
            //console.log(sendButton);  debug
            sendButton.addEventListener("click", function () {
               // console.log("inside the event listener of button"); debug
                const inputField = typingArea.querySelector(".input-field");
                const messageContent = inputField.value.trim();
                if (!messageContent) return;
                sendMessage(messageContent);
                inputField.value = ""; // Clear the box after sending the message 
            });
        }
    }

    // Post a new message and update the chat
    function sendMessage(content) {
        fetch("/send_message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: content,
                receiver_id: currentFriendId
            })
        })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    console.error("Error sending message:", result.error);
                } else {
                    const placeholder = chatBox.querySelector("p");
                if (placeholder && placeholder.textContent.trim() === "No messages in this chat yet.") {
                    placeholder.remove();
                }
                    // Create the new outgoing message element
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('chat', 'outgoing');
                    messageElement.innerHTML = `
                        <div class="details">
                            <p>${result.content}</p>
                            <span class="timestamp">${result.timestamp}</span>
                        </div>
                    `;
                    // Insert the new message above the typing area
                    const typingArea = chatBox.querySelector(".typing-area");
                    chatBox.insertBefore(messageElement, typingArea);
                    chatBox.scrollTop = chatBox.scrollHeight;

                    // // Optionally, emit a socket event so other connected clients can update their chat windows
                    // socket.emit('message_sent', {
                    //     receiver_id: currentFriendId,
                    //     message: result.content,
                    //     timestamp: result.timestamp,
                    //     is_outgoing: true
                    // });
                }
            })
            .catch(err => {
                console.error("Error sending message:", err);
            });
    }

    // Optionally, you can set up periodic polling with setInterval as a fallback if WebSockets fail or for extra safety:
    // setInterval(() => {
    //     if (currentFriendId) {
    //         fetchMessages(currentFriendId);
    //     }
    // }, 5000);
});

