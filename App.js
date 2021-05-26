import * as services from './Services.js';
import User from './User.js'

let sender, receiver;

let login = `
    <div class="body">
        <div class="card">
            <h2>Log-In Account</h2>
            <form>
                <div class="input-border">
                    <input type="text" id="name" class="text" autocomplete="off" required>
                    <label>Name</label>
                    <div class="border"></div>
                </div>
                
                <div class="input-border">
                    <input type="password" id="password" class="text" autocomplete="off" required>
                    <label>Password</label>
                    <div class="border"></div>
                </div>
                
                <input href="#" id="login" type="submit" class="btn" value="Log In">
            </form>
        </div>
    </div>
`;


let root = document.getElementById('root');
if(sessionStorage.getItem('user')) {
    let user = sessionStorage.getItem('user');
    user = JSON.parse(user);
    sender = new User(user.name, user.password, user.id);
    let viewChatsHTML = `
        <div class="sender">${sender?.name}</div>
        <div class="container">
            <div class="sidebar" id="sidebar">
            </div>
            <div class="chat-container" id="chat-container">
            </div>
        </div>
    `;
    root.innerHTML = viewChatsHTML;
    let active_users = services.getActiveUsers(); 
    displayUsers(active_users);
} else {
    root.innerHTML = login;    
    handleLogin();
}


function handleLogin() {
    document.getElementById('login').addEventListener('click', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const password  = document.getElementById('password').value
        
        if(!name || !password) {
            alert("username and password is required");
            return;
        }
        
        let status = services.addNewUser(name, password);
        if(status.name === "AccessError") {
            alert("Incorrect username/password");
        } else if(status.id){
            let viewChatsHTML = `
                <div class="sender">${status?.name}</div>
                <div class="container">
                    <div class="sidebar" id="sidebar">
                    </div>
                    <div class="chat-container" id="chat-container">
                    </div>
                </div>
            `;
            root.innerHTML = viewChatsHTML;
            sender = new User(status.name, status.password, status.id);
            let active_users = services.getActiveUsers(); 
            displayUsers(active_users);
        } else {
            alert(status.message);
        }
    });    
}

function displayUsers(users) {
    let users_list = "<ul>";
    let current_user = JSON.parse(sessionStorage.getItem('user'));
    users.forEach(user => {
        if(user.name !== current_user?.name) {
            users_list += (receiver?.name === user?.name) ? 
            `
                <li>
                    <a id=${user.id} class="active" href="#">${user.name}</a>
                </li> 
            `
            :`
                <li>
                    <a id=${user.id} href="#">${user.name}</a>
                </li>
            `;
        }
    })
    users_list += "</ul>";
    document.getElementById('sidebar').innerHTML = users_list;
    handleUserChatBox(users);
}

function handleUserChatBox(users) {
    users.forEach(user => {
        let userLink = document.getElementById(user.id);
        if(userLink){
            userLink.addEventListener('click', event => {
                event.preventDefault();
                receiver = new User(user.name, user.password, user.id);
                displaySelectedUserChats(user);
            })
        }

    })
}

function displaySelectedUserChats(user) {
    let chatbox = `
        <div class="title-header" id="reciver-name">${user.name}</div>
        <div class="chatbox-messages-conotainer" id="messages"></div>
        <div class="chatbox-input-container">
            <textarea id="send_message" class="send-message"></textarea>
            <button id="send_message_btn" class="send-btn">send</button>
        </div>
    `;
    document.getElementById('chat-container').innerHTML = chatbox;
    sendMessage();
    setInterval(getAllChats, 500);
    displayUsers(services.getActiveUsers());
}

function sendMessage() {
    document.getElementById('send_message_btn').addEventListener('click', () => {
        let message = document.getElementById('send_message').value;
        services.addNewChat(message, sender, receiver);
        document.getElementById('send_message').value = "";
    });
}

function getAllChats() {
    let chats = services.getChats(sender.name, receiver.name);
    let chats_html = "";
    chats.forEach(chat => {
        let time = new Date(chat.time);
        time = `${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()}  ${time.getHours()}:${time.getMinutes()}`;
        chats_html += (chat?.sender?.name === sender.name) ?
         `<div align="right">
            <div class="sender-text">
                <span>${chat.message}</span>
                <div class="date">${time}</div>
            </div>
          </div>` :
         `<div align="left">
            <div class="reciever-text">
                <span>${chat.message}</span>
                <div class="date">${time}</div>
            </div>
          </div>`;
    })
    document.getElementById('messages').innerHTML = chats_html;
}