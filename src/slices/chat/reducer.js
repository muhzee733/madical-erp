// chat.reducer.js
import {
  ADD_MESSAGE,
  SET_MESSAGES,
  SET_ROOM_ID,
  CLEAR_MESSAGES,
} from "./chat.types";
const initialState = {
  roomId: null,
  messages: [],
  chatRooms: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROOM_ID:
      return { ...state, roomId: action.payload };
    case ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case SET_MESSAGES:
      return { ...state, messages: action.payload };
    case CLEAR_MESSAGES:
      return { ...state, messages: [] };
    case 'SET_CHAT_ROOMS':
      return { ...state, chatRooms: action.payload };
    default:
      return state;
  }
};

export default chatReducer;
