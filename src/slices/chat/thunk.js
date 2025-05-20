// src/redux/actions/chat.js
import { sendMessage, listenToMessages } from "../../helpers/chat";
import {
  ADD_MESSAGE,
  SET_ROOM_ID,
  CLEAR_MESSAGES,
} from "./chat.types";
import axios from 'axios';
import Cookies from 'js-cookie';

export const startChatListener = (roomId) => {
  return (dispatch) => {
    dispatch({ type: SET_ROOM_ID, payload: roomId });
    dispatch({ type: CLEAR_MESSAGES });

    listenToMessages(roomId, (newMessage) => {
      dispatch({ type: ADD_MESSAGE, payload: newMessage });
    });
  };
};

export const sendChatMessage = (roomId, messageData) => {
  return async () => {
    await sendMessage(roomId, messageData);
  };
};

export const fetchChatRooms = () => {
  return async (dispatch) => {
    const token = Cookies.get('authUser');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/rooms/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: 'SET_CHAT_ROOMS', payload: response });
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };
};
