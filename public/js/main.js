const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
socket.on("message", message => {
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})
socket.emit("joinRoom", {username, room})

socket.on("roomUsers", ({room, users}) => {
    console.log(room, users);
    outputRoomName(room);
    outputUser(users)
})
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("chatMessage", e.target.elements.msg.value)
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();

})

function outputMessage(message) {
    const newEle = document.createElement("div");
    newEle.classList.add("message");
    newEle.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
    `
    chatMessages.appendChild(newEle);
}

function outputRoomName(room){
    roomName.innerHTML = room;
}

function outputUser(users){
    
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}