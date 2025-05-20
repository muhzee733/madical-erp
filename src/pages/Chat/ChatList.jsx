import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms } from '../../slices/chat/thunk';

const ChatList = ({ setRoomId, setDoctorId, selectedRoomId }) => {
  const dispatch = useDispatch();
  const chatRooms = useSelector((state) => state.Chat.chatRooms);

  useEffect(() => {
    dispatch(fetchChatRooms());
  }, [dispatch]);

  const handleRoomSelect = (room) => {
    setRoomId(room.id);
    setDoctorId(room.doctor);
  };

  return (
    <div className="chat-list p-3">
      <ul className="list-group gap-2 d-flex flex-column">
        {!chatRooms || chatRooms.length === 0 ? (
          <li className="list-group-item text-muted">No rooms available</li>
        ) : (
          chatRooms.map((room, index) => (
            <li
              key={room.id}
              onClick={() => handleRoomSelect(room)}
              className={`list-group-item list-group-item-action ${
                selectedRoomId === room.id ? 'active' : ''
              }`}
              style={{ 
                cursor: 'pointer',
                backgroundColor: selectedRoomId === room.id ? 'black' : 'transparent'
              }}
            >
              Room #{index + 1}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ChatList;
