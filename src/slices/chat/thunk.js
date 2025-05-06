import axios from "axios";
import {
  SET_SOCKET,
  SET_ROOM_ID,
  ADD_MESSAGE,
  CLEAR_MESSAGES,
  SET_MESSAGES,
} from "./chat.types";
import Cookies from "js-cookie";

let socketInstance = null;

// Connect to WebSocket
export const connectToChatRoom = (roomId) => {
  return (dispatch, getState) => {
    const userData = Cookies.get("user");
    const user = JSON.parse(userData);
    const socketUrl = `ws://replica.madical-cluster-test.4tvfug.eun1.cache.amazonaws.com/ws/chat/${roomId}/?user_id=${user?.id}`;

    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
      // dispatch({ type: SET_SOCKET, payload: socket });
      dispatch({ type: SET_SOCKET, payload: "connected" });
      dispatch({ type: SET_ROOM_ID, payload: roomId });
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data, "data");
      dispatch({ type: ADD_MESSAGE, payload: data });
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
      dispatch({ type: SET_SOCKET, payload: null });
    };

    socketInstance = socket;
  };
};

// Send message via WebSocket and save via REST
export const sendMessage = (messageObj) => {
  return (dispatch) => {
    if (socketInstance && socketInstance.readyState === WebSocket.OPEN) {
      socketInstance.send(JSON.stringify(messageObj));
    } else {
      console.error("WebSocket is not open");
    }
  };
};

// Fetch old messages from API
export const fetchMessages = (roomId) => {
  const token = Cookies.get("authUser");
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/messages/${roomId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const messages = response.data;
      dispatch({ type: SET_MESSAGES, payload: messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
};

// Fetch list of chat rooms
export const fetchRooms = () => {
  const token = Cookies.get("authUser");
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/rooms/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const rooms = response;
      return rooms;
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      return [];
    }
  };
};
