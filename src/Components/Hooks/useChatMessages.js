import { ref, onChildAdded } from "firebase/database";
import { useEffect, useState } from "react";
import database from "../firebase/firebase";

export function useChatMessages(roomId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!roomId) return;

    const chatRef = ref(database, `chat_ref/${roomId}`);
    const unsubscribe = onChildAdded(chatRef, (snapshot) => {
      const data = snapshot.val();
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      // Firebase doesn't require manual unsubscribe for onChildAdded
    };
  }, [roomId]);

  return messages;
}
