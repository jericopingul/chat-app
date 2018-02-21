import React from 'react'
import FaVideoCamera from 'react-icons/lib/fa/video-camera';
import FaUserPlus from 'react-icons/lib/fa/user-plus';
import MdKeyboardControl from 'react-icons/lib/md/keyboard-control';

export default function ({name, numberOfUsers}) {
    return (
        <div className="chat-header">
            <div className="user-info">
                <div className="user-name"></div>
                <div className="status">
                    <div className="indicator"></div>
                    <span>{numberOfUsers ? numberOfUsers : null}</span>
                </div>
            </div>
            <div className="options">
                <FaVideoCamera />
                <FaUserPlus />
                <MdKeyboardControl />
            </div>
        </div>
    )
}
