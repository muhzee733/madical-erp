import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms, GetChatRoomMessage, markAllMessagesRead } from '../../slices/chat/thunk';
import { Spinner } from 'reactstrap';

const ChatList = ({ setRoomId, setDoctorId, selectedRoomId }) => {
  const dispatch = useDispatch();
  const chatRooms = useSelector((state) => state.Chat.chatRooms);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchChatRooms()).finally(() => setLoading(false));
  }, [dispatch]);

  const handleRoomSelect = async (room) => {
    dispatch({ type: 'SET_CHAT_LOADING', payload: true });
    await dispatch(GetChatRoomMessage(room.id));
    setRoomId(room.id);
    setDoctorId(room.doctor);
    dispatch(markAllMessagesRead(room.id));
  };

  return (
    <div className="chat-list p-3">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100px'}}>
          <Spinner color="primary" />
        </div>
      ) : (
        <ul className="list-group gap-2 d-flex flex-column">
          {!chatRooms || chatRooms.length === 0 ? (
            <li className="list-group-item text-muted">No rooms available</li>
          ) : (
            chatRooms.data?.map((room, index) => (
              <li
                key={room.id}
                onClick={room.status === 'active' ? () => handleRoomSelect(room) : undefined}
                className={`list-group-item list-group-item-action ${
                  selectedRoomId === room.id ? 'active' : ''
                } ${room.status !== 'active' ? 'disabled text-muted' : ''}`}
                style={{ 
                  cursor: room.status === 'active' ? 'pointer' : 'not-allowed',
                  backgroundColor: selectedRoomId === room.id ? 'black' : 'transparent',
                  opacity: room.status === 'active' ? 1 : 0.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>Room #{index + 1}</span>
                <span className="d-flex align-items-center gap-2">
                  {room.status === 'active' ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-secondary">Inactive</span>
                  )}
                  {room.unread_count > 0 && (
                    <span className="badge bg-danger">{room.unread_count}</span>
                  )}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
