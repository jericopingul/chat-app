import React, { Component } from 'react';
import SideBar from './SideBar';
import { MESSAGE_SENT, TYPING } from '../../Events';

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
     * @param typing {boolean} if the user is tying still or not
     */
    sendTyping = (chatId, typing) => {
        const { socket } = this.props;
        socket.emit(TYPING, { chatId, typing });
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
                                <Messages messages={activeChat.messages} 
                                    user={user} 
                                    typingUser={activeChat.typingUser}
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
                        ) : (
                            <div></div>
                        )
                    }
                </div>
            </div>
        )
    }
}
