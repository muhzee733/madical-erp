import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchRooms } from "../../slices/chat/thunk";

const ChatList = ({ setRoomId }) => {
  const dispatch = useDispatch();
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null); // ⬅️ Track active room

  useEffect(() => {
    const loadRooms = async () => {
      const fetchedRooms = await dispatch(fetchRooms());
      setRooms(fetchedRooms || []);
    };
    loadRooms();
  }, [dispatch]);

  const handleRoomClick = (roomId) => {
    setActiveRoomId(roomId);   // ⬅️ Set active
    setRoomId(roomId);         // ⬅️ Pass to parent
  };

  return (
    <div className="chat-list p-3">
      <ul className="list-group gap-2 d-flex flex-column">
        {rooms.length === 0 ? (
          <li className="list-group-item text-muted">No rooms available</li>
        ) : (
          rooms.map((room, index) => (
            <li
              key={room.id}
              onClick={() => handleRoomClick(room.id)}
              className={`list-group-item list-group-item-action ${
                activeRoomId === room.id ? "active" : ""
              }`}
              style={{ cursor: "pointer" }}
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
