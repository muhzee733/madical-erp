// src/redux/actions/chat.js
import { sendMessage, listenToMessages } from "../../helpers/chat";
import {
  ADD_MESSAGE,
  SET_ROOM_ID,
  CLEAR_MESSAGES,
} from "./chat.types";
import axios from 'axios';
import Cookies from 'js-cookie';


export const fetchChatRooms = () => {
  return async (dispatch) => {
    const token = Cookies.get('authUser');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/chat/rooms/`, {
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

export const PostChatRooms = (payload) => {
  return async (dispatch) => {
    const token = Cookies.get('authUser');
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/chat/rooms/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: 'SET_ROOM_ID', payload: response });
      return response;
    } catch (error) {
      // Return error response for handling in the component
      if (error.response) {
        return error.response;
      }
      console.error('Error posting chat room:', error);
      throw error;
    }
  };
};

export const GetChatRoomMessage = (roomid) => {
  return async (dispatch) => {
    const token = Cookies.get('authUser');
    try {
      dispatch({ type: 'SET_CHAT_LOADING', payload: true });
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/chat/messages/${roomid}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: 'SET_MESSAGES', payload: response.data });
      dispatch({ type: 'SET_CHAT_LOADING', payload: false });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_CHAT_LOADING', payload: false });
      if (error.response) {
        return error.response;
      }
      console.error('Error fetching chat room messages:', error);
      throw error;
    }
  };
};

export const PostChatRoomMessage = (roomid, message) => {
  return async (dispatch) => {
    const token = Cookies.get('authUser');
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/chat/messages/${roomid}/`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: 'ADD_MESSAGE', payload: response.data });
      return response;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
      console.error('Error posting chat room message:', error);
      throw error;
    }
  };
};
