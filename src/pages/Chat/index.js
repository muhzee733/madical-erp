import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Button,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import classnames from "classnames";
import SimpleBar from "simplebar-react";
import ChatBox from "./ChatBox";
import Cookies from "js-cookie";
//redux
import { useSelector, useDispatch } from "react-redux";

import avatar2 from "../../assets/images/users/avatar-2.jpg";
import userDummayImage from "../../assets/images/users/user-dummy-img.jpg";

//Import Scrollbar
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import ChatList from "./ChatList";

const Chat = () => {
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {};
  const [Chat_Box_Username, setChat_Box_Username] = useState(userData);
  const [Chat_Box_Image, setChat_Box_Image] = useState(avatar2);
  const [roomIds, setRoomId] = useState(null);

  document.title = "Chat | ProMedicine";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
            <div className="chat-leftsidebar">
              <div className="px-4 pt-4 mb-4">
                <div className="d-flex align-items-start">
                  <div className="flex-grow-1">
                    <h5 className="mb-4">Chats</h5>
                  </div>
                </div>
                <div className="search-box">
                  <input
                    id="search-user"
                    type="text"
                    className="form-control bg-light border-light"
                    placeholder="Search here..."
                  />
                  <i className="ri-search-2-line search-icon"></i>
                </div>
              </div>
              <Nav
                tabs
                className="nav nav-tabs nav-tabs-custom nav-success nav-justified mb-3"
              >
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({
                      active: customActiveTab === "1",
                    })}
                    onClick={() => {
                      toggleCustom("1");
                    }}
                  >
                    Chats
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({
                      active: customActiveTab === "2",
                    })}
                    onClick={() => {
                      toggleCustom("2");
                    }}
                  >
                    Contacts
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={customActiveTab} className="text-muted">
                <TabPane tabId="1" id="chats">
                  <SimpleBar
                    className="chat-room-list pt-3"
                    style={{ margin: "-16px 0px 0px" }}
                  >
                    <div className="d-flex align-items-center px-4 mb-2">
                      <div className="flex-grow-1">
                        <h4 className="mb-0 fs-11 text-muted text-uppercase">
                          Direct Messages
                        </h4>
                      </div>
                    </div>

                    <div className="chat-message-list">
                      <ul
                        className="list-unstyled chat-list chat-user-list mb-0 users-list"
                        id="channelList"
                      >
                        <ChatList setRoomId={setRoomId} />
                      </ul>
                    </div>
                  </SimpleBar>
                </TabPane>
              </TabContent>
            </div>

            <div className="user-chat w-100 overflow-hidden">
              <div className="chat-content d-lg-flex">
                <div className="w-100 overflow-hidden position-relative">
                  <div className="position-relative">
                    <ChatBox
                      roomId={roomIds}
                      Chat_Box_Image={Chat_Box_Image}
                      Chat_Box_Username={Chat_Box_Username}
                      userDummayImage="/assets/images/user.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Chat;
