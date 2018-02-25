import React, { Component } from 'react';
import SideBar from './SideBar';
import { MESSAGE_SENT, TYPING, COMMUNITY_CHAT, MESSAGE_RECEIVED } from '../../Events';
import ChatHeading from './ChatHeading';
import Messages from '../messages/Messages';
import MessageInput from '../messages/MessageInput';

export default class ChatContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            activeChat: null
        };
    }

    setActiveChat = (activeChat) => {
        this.setState({activeChat});
    }

    componentDidMount() {
        const { socket } = this.props;
        socket.emit(COMMUNITY_CHAT, this.resetChat);
    }

    /**
     * Reset the chat to only the chat passed in
     * @param {Chat} chat 
     */
    resetChat = (chat) => {
        return this.addChat(chat, true);
    }

    /**
     * Adds chat to the chat container, if reset is true removes all chats
     * and sets that chat to the main chat.
     * Sets the message and typing socket events for the chat
     * @param {Chat} chat the chat to be added
     * @param {boolean} reset if true will set the chat as the only chat
     */
    addChat = (chat, reset) => {
        const { socket } = this.props;
        const { chats } = this.state;

        const newChats = reset ? [chat] : [...chats, chat];
        // this.setState({chats: newChats, activeChat: reset ? chat: this.state.activeChat});
        this.setState({chats: newChats, activeChat: reset ? chat : this.state.activeChat});

        const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}`;
        const typingEvent = `${TYPING}-${chat.id}`;

        socket.on(typingEvent, this.updateTypingInChat(chat.id))
        socket.on(messageEvent, this.addMessageToChat(chat.id))
    }

    /**
     * Returns a function that will
     * add message to chat with the chatId passed in
     * @param chatId {number}
     */
    addMessageToChat = (chatId) => {
        return message => {
            const { chats } = this.state
            let newChats = chats.map( (chat) => {
                if(chat.id === chatId) {
                    chat.messages.push(message);
                }
                return chat;
            });

            this.setState({chats: newChats});
        }
    }

    /**
     * Updates the typing of the chat with id passed in
     * @param chatId {number}
     */
    updateTypingInChat = (chatId) => {
        return ({isTyping, user}) => {
            if(user !== this.props.user.name) {

                const { chats } = this.state;
                
                let newChats = chats.map((chat) => {
                    if(chat.id === chatId) {
                        if(isTyping && !chat.typingUsers.includes(user)) { // user typing is already in the typing users in chat
                            chat.typingUsers.push(user);
                        } else if(!isTyping && chat.typingUsers.includes(user)) { // user is not typing and already in typing users array in chat
                            chat.typingUsers = chat.typingUsers.filter(u => u !== user);
                        }
                    }
                    return chat;
                })
                this.setState({chats: newChats});
            }
        }
    }

    /**
     * Adds a message to the specified chat
     * @param chatId {number} The id of the chat to be added to
     * @param message {string} The message to be added to the chat
     */
    sendMessage = (chatId, message) => {
        const { socket } = this.props;
        socket.emit(MESSAGE_SENT, { chatId, message });
    }

    /**
     * Sends typing status to server
     * @param chatId {number} the id of the chat being typed in
     * @param isTyping {boolean} if the user is tying still or not
     */
    sendTyping = (chatId, isTyping) => {
        const { socket } = this.props;
        socket.emit(TYPING, { chatId, isTyping });
    }
    
    render() {
        const { user, logout} = this.props;
        const { chats, activeChat } = this.state;
        return (
            <div className="container">
                <SideBar 
                    logout={logout} 
                    chats={chats} 
                    user={user} 
                    activeChat={activeChat} 
                    setActiveChat={this.setActiveChat} 
                    />
                Chat Container
                <div className="chat-room-container">
                    {
                        activeChat !== null ? (
                            <div className="chat-room">
                                <ChatHeading name={activeChat.name} />
                                <Messages 
                                    messages={activeChat.messages} 
                                    user={user} 
                                    typingUsers={activeChat.typingUsers}
                                    />
                                <MessageInput 
                                    sendMessage={
                                        (message) => {
                                            this.sendMessage(activeChat.id, message)
                                        }
                                    }
                                    sendTyping={
                                        (isTyping) => {
                                            this.sendTyping(activeChat.id, isTyping)
                                        }
                                    }
                                    />
                            </div>
                        ) :
                        <div className="chat-room choose">
                            <h3>Choose a chat!</h3>
                        </div>
                    
                    }
                </div>
            </div>
        )
    }
}
