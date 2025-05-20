// Firebase-integrated ChatBox.js
import{ useEffect, useRef, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  where,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Cookies from "js-cookie";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Row, Col, Button, Spinner } from "reactstrap";
import { Link } from "react-router-dom";

const ChatBox = ({ roomId, Chat_Box_Image, Chat_Box_Username, userDummayImage, doctorId }) => {
  const messagesEndRef = useRef(null);
  const userData = JSON.parse(Cookies.get("user") || "{}");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isDoctor, setIsDoctor] = useState(userData.role === 'doctor');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (roomId) {
      setIsLoading(true);
      const q = query(
        collection(db, "madical"),
        where("roomId", "==", roomId),
        orderBy("timestamp", "asc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
        setIsLoading(false);
        
        // Scroll to bottom after messages load
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
              behavior: "smooth",
              block: "end"
            });
          }
        }, 100);
      }, (error) => {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
        if (error.code === 'failed-precondition') {
          console.log("Please create the required index at:", error.message);
        }
      });
  
      return () => unsubscribe();
    }
  }, [roomId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  }, [messages]);

  // Add new useEffect for initial scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "auto",
        block: "end"
      });
    }
  }, [roomId]); // Scroll when room changes

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!roomId) {
      console.error('No room ID provided');
      return;
    }

    try {
      const messageData = {
        message,
        roomId,
        sender: userData.id,
        senderType: userData.role,
        receiverId: isDoctor ? userData.id : doctorId,
        senderName: userData.first_name || 'User',
        timestamp: new Date(),
      };

      await addDoc(collection(db, "madical"), messageData);
      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

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
            {isLoading ? (
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
                                  {msg.fileType.startsWith('image/') ? (
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
                                <p className="mb-0 ctext-content">{msg.message}</p>
                              )}
                              <small className="text-muted">
                                {msg.senderName} ({msg.senderType})
                              </small>
                            </div>
                          </div>
                          <div className="conversation-name">
                            <small className="text-muted time">
                              {msg.timestamp?.toDate?.().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              }) || "Now"}
                            </small>
                            <span className="text-success check-message-icon">
                              <i className="ri-check-double-line align-bottom"></i>
                            </span>
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

      {/* Chat Input */}
      <div className="chat-input-section p-3 p-lg-4">
        <form onSubmit={handleSend}>
          <Row className="g-0 align-items-center">
            <div className="col">
              <input
                type="text"
                className="form-control chat-input bg-light border-light"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) handleSend(e);
                }}
              />
            </div>
            <div className="col-auto">
              <div className="chat-input-links ms-2">
                <Button 
                  type="submit" 
                  color="success" 
                  className="chat-send waves-effect waves-light"
                >
                  <i className="ri-send-plane-2-fill align-bottom"></i>
                </Button>
              </div>
            </div>
          </Row>
        </form>
      </div>
    </>
  );
};

export default ChatBox;
