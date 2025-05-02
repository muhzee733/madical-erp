import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../slices/chat/thunk";
import Cookies from "js-cookie";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { sendMessage } from "../../slices/chat/thunk";
import { connectToChatRoom } from "../../slices/chat/thunk";

const ChatBox = ({
  roomId,
  Chat_Box_Image,
  Chat_Box_Username,
  userDummayImage,
}) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.Chat.messages);
  const messagesEndRef = useRef(null);
  const userData = JSON.parse(Cookies.get("user") || "{}");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (roomId) {
      dispatch(fetchMessages(roomId));
    }
  }, [roomId, dispatch]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const messageObj = {
      room: roomId,
      message: message,
      sender: userData.id,
      timestamp: new Date().toISOString()
    };

    dispatch(sendMessage(messageObj));
    setMessage("");
  };

  useEffect(() => {
    if (roomId) {
      dispatch(connectToChatRoom(roomId));
    }
  }, [dispatch, roomId]);

  if (!roomId) {
    return (
      <div className="text-center text-muted mt-5">
        <h6>No room selected. Please book your appointment for doctor chat.</h6>
      </div>
    );
  }
  

  return (
    <>
      {/* Chat Header */}
      <div className="p-3 user-chat-topbar">
        <Row className="align-items-center">
          <Col sm={4} xs={8}>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 d-block d-lg-none me-3">
                <Link to="#" className="user-chat-remove fs-18 p-1">
                  <i className="ri-arrow-left-s-line align-bottom"></i>
                </Link>
              </div>
              <div className="flex-grow-1 overflow-hidden">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0 chat-user-img online user-own-img align-self-center me-3 ms-0">
                    <img
                      src={Chat_Box_Image || userDummayImage}
                      className="rounded-circle avatar-xs"
                      alt=""
                    />
                    <span className="user-status"></span>
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <h5 className="text-truncate mb-0 fs-16">
                      <a
                        className="text-reset username"
                        data-bs-toggle="offcanvas"
                        href="#userProfileCanvasExample"
                        aria-controls="userProfileCanvasExample"
                      >
                        {Chat_Box_Username?.first_name || "User"}
                      </a>
                    </h5>
                    <p className="text-truncate text-muted fs-14 mb-0 userStatus">
                      <small>Online</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Chat Messages */}
      <div className="position-relative" id="users-chat">
        <div className="chat-conversation p-3 p-lg-4" id="chat-conversation">
          <PerfectScrollbar>
            <ul
              className="list-unstyled chat-conversation-list"
              id="users-conversation"
            >
              {messages?.map((message, key) => (
                <li
                  className={
                    message.sender === userData.id
                      ? "chat-list left"
                      : "chat-list right"
                  }
                  key={key}
                >
                  <div className="conversation-list">
                    <div className="user-chat-content">
                      <div className="ctext-wrap">
                        <div className="ctext-wrap-content">
                          <p className="mb-0 ctext-content">
                            {message.message}
                          </p>
                        </div>
                      </div>
                      <div className="conversation-name">
                        <small className="text-muted time">
                          <small className="text-muted time">
                            {message.timestamp
                              ? new Date(message.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : "Now"}
                          </small>
                        </small>
                        <span className="text-success check-message-icon">
                          <i className="ri-check-double-line align-bottom"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              <div ref={messagesEndRef} />
            </ul>
          </PerfectScrollbar>
        </div>
      </div>

      {/* Chat Input */}
      <div className="chat-input-section p-3 p-lg-4">
        <form id="chatinput-form" onSubmit={handleSend}>
          <Row className="g-0 align-items-center">
            <div className="col">
              <div className="chat-input-feedback">Please Enter a Message</div>
              <input
                type="text"
                className="form-control chat-input bg-light border-light"
                id="chat-input"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSend(e);
                  }
                }}
              />
            </div>
            <div className="col-auto">
              <div className="chat-input-links ms-2">
                <div className="links-list-item">
                  <Button
                    type="submit"
                    color="success"
                    className="chat-send waves-effect waves-light"
                  >
                    <i className="ri-send-plane-2-fill align-bottom"></i>
                  </Button>
                </div>
              </div>
            </div>
          </Row>
        </form>
      </div>
    </>
  );
};

export default ChatBox;
