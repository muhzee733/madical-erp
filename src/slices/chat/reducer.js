import {
  SET_SOCKET,
  SET_ROOM_ID,
  ADD_MESSAGE,
  CLEAR_MESSAGES,
} from './chat.types';

const initialState = {
  socket: null,
  roomId: null,
  messages: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SOCKET:
      return { ...state, socket: action.payload };
    case SET_ROOM_ID:
      return { ...state, roomId: action.payload };
    case ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case CLEAR_MESSAGES:
      return { ...state, messages: [] };
    default:
      return state;
  }
};

export default chatReducer;
