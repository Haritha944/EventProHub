import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import WebSocketService from '../utils/WebSocketService';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ChatUserComponent = ({ booking, onClose,}) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const chatContainerRef = useRef(null);
    const token = useSelector(state => state.user.token);
    const {currentUser } = useSelector(state => state.user);
     


    useEffect(() => {
      // Connect the WebSocket using the userId
      if (currentUser.id) {
        WebSocketService.connect(currentUser.id);
      }
  
      return () => {
        // Clean up WebSocket connection when component unmounts
        WebSocketService.disconnect();
      };
    }, [currentUser.id]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`${BASE_URL}chats/chat-history/${booking.id}/`, {
          headers: {
            Authorization: `Bearer ${token.access}`,
          }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();

    WebSocketService.addListener(`chat_${booking.id}`, handleChatMessage);

    return () => {
      WebSocketService.removeListener(`chat_${booking.id}`);
    };
  }, [booking.id, currentUser.id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleChatMessage = (data) => {
    if (data.type === 'new_message_notification' && data.booking_id === booking.id) {
      const newMessage = {
        ...data,
        isSentByCurrentUser: data.sender_id === currentUser.id.toString()
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !currentUser.id) {
      console.error('Cannot send message: message is empty or user ID is not available');
      return;
    }
  
    const senderId = currentUser.id;
    let receiverEmail;
    console.log("User status",currentUser.is_servicer)
    console.log("correct",booking)


    console.log("Booking",booking.service.servicer.email)
    if (currentUser.is_servicer) {
      receiverEmail = booking.user?.email || null;
    } else {
      receiverEmail = booking.service.servicer.email || null;
    }
  
    if (!receiverEmail) {
      console.error('No valid receiver email');
      return;
    }
  
    const newMessage = {
      type: 'chat_message',
      booking_id: booking.id,
      message: inputMessage.trim(),
      sender_id: senderId,
      receiver_email: receiverEmail,
      timestamp: new Date().toISOString(),
      isSentByCurrentUser: true
    };
  
    console.log("Sending message:", JSON.stringify(newMessage, null, 2));
    WebSocketService.send(newMessage);
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage('');
  };

  const receiverName = currentUser.is_servicer? booking.user?.name : booking.service.servicer.name;
  


  return (
    <div>
        <div className="fixed bottom-5 right-5 w-80 h-96 border border-gray-300 rounded-lg bg-white flex flex-col shadow-lg">
      <div className="p-2 border-b border-gray-300 flex justify-between items-center">
        <div className="flex items-center">
          
          <h3 className="font-bold text-sm">{receiverName}</h3>
        </div>
        <button onClick={onClose} className="bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700">Close</button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`my-1 p-2 rounded-lg max-w-xs ${msg.isSentByCurrentUser ? 'bg-green-200 self-end' : 'bg-gray-300 self-start'}`}>
            {msg.message}
            <span className="text-xs text-gray-600 ml-1">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="flex p-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
        />
        <button onClick={sendMessage} className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-700">Send</button>
      </div>
    </div>
    </div>
  )
}

export default ChatUserComponent