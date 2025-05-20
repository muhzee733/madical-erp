// src/helpers/chat.js
import { ref, push, onChildAdded } from "firebase/database";
import { db } from "../firebase/firebase";

// Send message
export const sendMessage = async (roomId, messageData) => {
  const chatRef = ref(db, `chats/${roomId}`);
  await push(chatRef, messageData);
};

// Listen to messages
export const listenToMessages = (roomId, callback) => {
  const chatRef = ref(db, `chats/${roomId}`);
  onChildAdded(chatRef, (snapshot) => {
    callback({ id: snapshot.key, ...snapshot.val() });
  });
};
