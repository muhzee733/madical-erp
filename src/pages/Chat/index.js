import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Card, CardBody } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { connectToChatRoom, sendMessage, fetchMessages, clearMessages } from '../../slices/chat/thunk';
import Cookies from 'js-cookie';

const Chat = () => {
  // const { roomId } = useParams();
  // console.log(roomId, 'id')
  const roomId = 5;
  const user = Cookies.get('user');
  const userId = 4152;
  const dispatch = useDispatch();
  const { messages = [], socket } = useSelector((state) => state.chat || {});
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    dispatch(connectToChatRoom(roomId));
    dispatch(fetchMessages(roomId));

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [dispatch, roomId, userId, socket]);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const messageObj = { sender: userId, message: currentMessage };
      dispatch(sendMessage(messageObj));
      setCurrentMessage('');
    }
  };

  const handleDeleteMessage = (id) => {
    dispatch(clearMessages(id));
  };

  return (
    <div className="position-relative" id="chat">
      <div className="chat-conversation p-3 p-lg-4">
        <div className="chat-conversation-list">
          {messages.map((message, index) => (
            <div key={index} className="chat-list">
              <div className="conversation-list">
                <div className="chat-avatar">
                  <img src="userDummayImage.jpg" alt="User" />
                </div>
                <div className="user-chat-content">
                  <div className="ctext-wrap">
                    <div className="ctext-wrap-content">
                      <p className="mb-0 ctext-content">{message.message}</p>
                    </div>
                    <div className="message-options">
                      <Button color="link" onClick={() => handleDeleteMessage(message.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="conversation-name">
                    <small className="text-muted time">09:07 am</small>
                    <span className="text-success check-message-icon">
                      <i className="ri-check-double-line align-bottom"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-input-section p-3 p-lg-4">
        <form id="chatinput-form">
          <Row className="g-0 align-items-center">
            <div className="col">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="form-control chat-input bg-light border-light"
                placeholder="Type your message..."
              />
            </div>

            <div className="col-auto">
              <Button color="success" onClick={handleSendMessage} className="chat-send">
                <i className="ri-send-plane-2-fill align-bottom"></i>
              </Button>
            </div>
          </Row>
        </form>
      </div>
    </div>
  );
};

export default Chat;
