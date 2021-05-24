import Chat from './Chat.js';
import User from './User.js';

function validateUser(user, password) {
    if(user?.password === password) {
        sessionStorage.setItem('user', JSON.stringify(user));
        return user;
    } else {
        let error = new Error('unauthorized access');
        error.name = 'AccessError';
        throw error;
    }
}

function getActiveUsers() {
    const users = localStorage.getItem('users') ?? "[]";
    let users_list = JSON.parse(users);
    return users_list.map(user => new User(user.name, user.password, user.id));
}

function addNewUser(name, password) {
    let users, user_exists, user;

    users = localStorage.getItem('users') ?? "[]";
    users = JSON.parse(users);
    user_exists = users.filter(user => user.name === name);

    if(user_exists.length > 0) {
        try {
            return validateUser(user_exists[0], password);
        } catch (error) {
            return error;
        }

    } else {
        user = new User(name, password);
        users.push(user);
        localStorage.setItem('users',JSON.stringify(users));
        sessionStorage.setItem('user', JSON.stringify(user));
        return user;
    }
}

function addNewChat(message, sender, receiver) {
    try {
        let chat = new Chat(message, sender, receiver);
        let chats = localStorage.getItem('chats') ?? "[]";
        chats = JSON.parse(chats);
        chats.push(chat);
        localStorage.setItem('chats', JSON.stringify(chats));
        return true;        
    } catch (error) {
        return false;
    }
}

function getChats(sender, receiver) {
    let chats = localStorage.getItem('chats') ?? "[]";
    chats = JSON.parse(chats);

    let filtered_chats = chats.filter(chat => (chat?.receiver?.name === receiver && chat?.sender?.name === sender) 
                                                || (chat?.receiver?.name === sender && chat?.sender?.name === receiver));
    
    filtered_chats = filtered_chats.map(chat => {
        let receiver = chat?.receiver;
        receiver = new User(receiver?.name, receiver?.password, receiver?.id);
        
        let sender = chat?.sender;
        sender = new User(sender?.name, sender?.password, sender?.id);
        
        return new Chat(chat?.message, chat?.sender, chat?.receiver, chat?.time);
    });

    return filtered_chats
}

export {
    getActiveUsers,
    addNewUser,
    addNewChat,
    getChats
}