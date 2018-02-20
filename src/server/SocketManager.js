const io = require('./index.js').io

const { VERIFY_USER, USER_CONNECTED, LOGOUT } = require('../Events') 
const { createUser, createMessage, createChat } = require('../Factories')

let connectedUsers = {}

module.exports = function(socket) {
    console.log('Socket Id:', socket.id);

    // Verify Username
    socket.on(VERIFY_USER, (nickname, callback) => {
        if(isUser(connectedUsers, nickname)) {
            callback({ isUser: true, user: null })
        } else {
            callback({ isUser: false, user: createUser({name: nickname}) })
        }
    });

    // User Connects with username
    socket.on(USER_CONNECTED, (user) => {
        connectedUsers = addUser(connectedUsers, user);
        socket.user = user;

        io.emit(USER_CONNECTED, connectedUsers);
        console.log(connectedUsers);
    });
}

/**
 * Adds user to list passed in
 * @param {Object} userList Object with key value pairs of users
 * @param {User} user the user to be added to the list 
 * @return {Object} 
 */
function addUser(userList, user) {
    let newList = Object.assign({}, userList);
    newList[user.name] = user;
    return newList;
}


/**
 * Removes user from the list passed in
 * @param {Object} userList Object with key value pairs of Users
 * @param {String} username name of user to be removed
 * @return {Object}
 */
function removeUser(userList, username) {
    let newList = Object.assign({}, userList);
    delete newList[username];
    return newList;
}

/**
 * Checks if the user is in list passed in
 * @param {Object} userList Object with key value pairs of Users
 * @param {String} username 
 * @return {Boolean}
 */
function isUser(userList, username) {
    return username in userList;
}