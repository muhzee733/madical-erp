import axios from 'axios';
import {
  SET_SOCKET,
  SET_ROOM_ID,
  ADD_MESSAGE,
  CLEAR_MESSAGES,
} from './chat.types';
import Cookies from 'js-cookie';

let socketInstance = null;

// Connect to WebSocket
export const connectToChatRoom = (roomId, userId, appointmentId) => {
  return (dispatch) => {
    // const userId = Cookies.get('user');
    const userId = 4152;
    const socketUrl = `ws://localhost:8000/ws/chat/${roomId}/?user_id=${userId}`;
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
      dispatch({ type: SET_SOCKET, payload: socket });
      dispatch({ type: SET_ROOM_ID, payload: roomId });
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      dispatch({ type: ADD_MESSAGE, payload: data });
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
      dispatch({ type: SET_SOCKET, payload: null });
    };

    socketInstance = socket;
  };
};

// Send message via WebSocket and save via REST
export const sendMessage = (messageObj) => {
  return async (dispatch, getState) => {
    const { roomId } = getState().chat;

    // Send over WebSocket
    if (socketInstance && socketInstance.readyState === WebSocket.OPEN) {
      socketInstance.send(JSON.stringify(messageObj));
    }

    // Save to backend
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/messages/${roomId}/`, messageObj);
    } catch (error) {
      console.error('Error saving message to backend:', error);
    }
  };
};

// Fetch old messages from API
export const fetchMessages = (roomId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/messages/${roomId}/`);
      console.log(response, 'fetch message')
      const messages = response.data;
      messages.forEach((msg) => {
        dispatch({ type: ADD_MESSAGE, payload: msg });
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
};

export const clearMessages = () => ({ type: CLEAR_MESSAGES });
