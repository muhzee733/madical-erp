// Firebase-integrated ChatBox.js
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PostChatRoomMessage, markAppointmentCompleted } from "../../slices/chat/thunk";
import Cookies from "js-cookie";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Row, Col, Button, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const ChatBox = ({ roomId, Chat_Box_Image, Chat_Box_Username, userDummayImage, doctorId, appointmentId }) => {

  // console.log(appointmentId, 'appointmentId')
  const messagesEndRef = useRef(null);
  const userData = JSON.parse(Cookies.get("user") || "{}");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.Chat.messages) || [];
  const [isSending, setIsSending] = useState(false);
  const [isDoctor] = useState(userData.role === 'doctor');
  const chatLoading = useSelector((state) => state.Chat.chatLoading);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !roomId) return;
    setIsSending(true);
    await dispatch(PostChatRoomMessage(roomId, message));
    setMessage("");
    setIsSending(false);
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);
  };

  const handleMarkCompleted = async () => {
    try {
      const result = await dispatch(markAppointmentCompleted(appointmentId));
      Swal.fire("Success!", result.message, "success");
    } catch (error) {
      Swal.fire("Error!", error.message || "Failed to mark appointment as completed.", "error");
    }
  };

  if (!roomId) {
    return (
      <div className="text-center text-muted mt-5">
        <h6>No room selected. Please select a chat room to start messaging.</h6>
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
                      <a className="text-reset username" href="#">
                        {Chat_Box_Username?.first_name || "User"}
                      </a>
                    </h5>
                    <p className="text-truncate text-muted fs-14 mb-0 userStatus">
                      <small>{isDoctor ? 'Doctor' : 'Patient'}</small>
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
            {chatLoading ? (
              <div className="text-center py-4">
                <Spinner color="primary" className="me-2" />
                <span>Loading messages...</span>
              </div>
            ) : (
              <ul className="list-unstyled chat-conversation-list" id="users-conversation">
                {messages.length === 0 ? (
                  <div className="text-center text-muted mt-5">
                    <h6>No messages yet. Start the conversation!</h6>
                    <p className="text-muted">Send a message to begin chatting.</p>
                  </div>
                ) : (
                  messages?.map((msg, idx) => (
                    <li 
                      className={msg.sender === userData.id ? "chat-list left" : "chat-list right"} 
                      key={idx}
                    >
                      <div className="conversation-list">
                        <div className="user-chat-content">
                          <div className="ctext-wrap">
                            <div className="ctext-wrap-content">
                              {msg.fileUrl ? (
                                <div className="message-file">
                                  {msg.fileType && msg.fileType.startsWith('image/') ? (
                                    <img 
                                      src={msg.fileUrl} 
                                      alt={msg.fileName} 
                                      className="img-fluid rounded"
                                      style={{ maxHeight: '200px' }}
                                    />
                                  ) : (
                                    <a 
                                      href={msg.fileUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="btn btn-light btn-sm"
                                    >
                                      <i className="ri-file-pdf-line me-1"></i>
                                      {msg.fileName}
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <span>{msg.message}</span>
                              )}
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-1">
                              <small className="text-muted">{msg.sender_name || 'Unknown'}</small>
                              <small className="text-muted ms-2">
                                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
                <div ref={messagesEndRef} />
              </ul>
            )}
          </PerfectScrollbar>
        </div>
      </div>

      {/* Message Input */}
      <form className="chat-input-section p-3 p-lg-4 border-top mb-0" onSubmit={handleSend}>
        <div className="row g-0 align-items-center">
          <div className="col">
            <input
              type="text"
              className="form-control form-control-lg bg-light border-light"
              placeholder="Enter Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
            />
          </div>
          <div className="col-auto d-flex gap-2 align-items-center">
            <Button color="primary" type="submit" disabled={isSending || !message.trim()}>
              {isSending ? <Spinner size="sm" /> : <i className="ri-send-plane-2-fill"></i>}
            </Button>
            {/* {isDoctor && (
              <Button color="success" type="button" onClick={handleMarkCompleted}>
                Mark Completed
              </Button>
            )} */}
          </div>
        </div>
      </form>
    </>
  );
};

export default ChatBox;
