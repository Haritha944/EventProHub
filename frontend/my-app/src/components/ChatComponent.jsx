import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ChatSidebarComponet from "./ChatSidebarComponet";
import axios from "axios";
import io from 'socket.io-client';

// const socket = io('http://localhost:3000');




const ChatComponent = () => {
    const [rooms, setRooms] = useState([]);
    const [activeRoomId, setActiveRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [ownerDetails, setOwnerDetails] = useState();
    const [newMessage, setNewMessage] = useState("");
    const [user, setUser] = useState(null);
    const [isServicer, setIsServicer] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const servicerId = query.get('id');
  
    const scroll = useRef();
    const socketRef = useRef(null);
  
    const navigate = useNavigate();
  
 
    // const handleFetchOwnerDetails = async()=>{
       
    // }




    const localBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const instance = axios.create({
      baseURL: localBaseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    useEffect(() => {
      try {
        // Retrieve 'ownerDetails' from localStorage
        const ownerDetails = JSON.parse(localStorage.getItem("ownerDetails"));
    
        // Check if ownerDetails is present and has the userID
        if (servicerId) {
          // Set author with the userID from ownerDetails
          setUser(servicerId);
    
          // Check if the user is a servicer
          if (ownerDetails.is_servicer) {
            // Fetch rooms specific to the servicer
            instance
              .get(`chat/rooms/?servicer=${servicerId}`)
              .then((response) => {
                setRooms(response.data);
                console.log(response.data);
                setActiveRoomId(response.data[0]?.id);
                setIsLoading(false); // Finished loading
              })
              .catch((error) => {
                console.error("Error:", error);
                setIsLoading(false);
              });
          } else {
            // Fetch all rooms for a normal user
            instance
              .get("chat/allrooms/")
              .then((response) => {
                setRooms(response.data);
                console.log(response.data);
                setActiveRoomId(response.data[0]?.id);
                setIsLoading(false); // Finished loading
              })
              .catch((error) => {
                console.error("Error:", error);
                setIsLoading(false);
              });
          }
        } else {
          // Check if 'userID' is available and fetch data if it's a regular user
          const userId = JSON.parse(localStorage.getItem("userId"));
    
          if (userId) {
            // Assuming there's a specific endpoint for regular users
            instance
              .get(`chat/rooms/?user=${userId}`)
              .then((response) => {
                setRooms(response.data);
                console.log(response.data);
                setActiveRoomId(response.data[0]?.id);
                setIsLoading(false); // Finished loading
              })
              .catch((error) => {
                console.error("Error:", error);
                setIsLoading(false);
              });
          } else {
            // Redirect to login if no user data is available
            throw new Error("User not authenticated or user data is missing.");
          }
        }
      } catch (e) {
        // Redirect to login if there's an error or if user data is missing
        toast.error("Please Login for community chat", { duration: 5000 });
      }
    }, [navigate]);
    

    useEffect(() => {
        if (activeRoomId) {
          socketRef.current = new WebSocket(
            `wss://localhost:8000/ws/chat/${activeRoomId}/`
          );
    
          socketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
          };
    
          instance
            .get(`chat/rooms/${activeRoomId}/messages/`)
            .then((response) => {
              setMessages(response.data);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching messages:", error);
              setIsLoading(false);
            });
        }
        return () => {
          if (socketRef.current) {
            socketRef.current.close();
          }
        };
      }, [activeRoomId]);
      
      const sendMessage = () => {
        console.log(user)
        const message = {
          content: newMessage,
          sender: user.id,
          room_id: activeRoomId,
        };
    
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify(message));
        }
    
        setNewMessage("");
      };
      useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);

      const isUserMessage = (message) =>
        message.sender === user.userID;
    
      const isServicerMessage = (message) =>
        message.sender === user.userID && message.room.servicer.id === user.userID;
    
      const filteredMessages = messages.filter((message) => {
        if (message.room && message.room.servicer) {
          if (user.is_servicer) {
            // Show messages sent by users in rooms where the current user is a servicer
            return message.room.servicer.id === user.userID || isUserMessage(message);
        } else {
            // Show messages sent by the current user and messages from servicers in rooms where the current user is participating
            return isUserMessage(message) || isServicerMessage(message);
        }
        }
        return false;
      });
    
  return (
    <>
    <div className="flex h-screen font-serif rounded-md bg-gray-200">
    <ChatSidebarComponet
                rooms={rooms}
                activeRoomId={activeRoomId}
                setActiveRoomId={setActiveRoomId}
            />
      <div className="w-3/4 flex flex-col h-full">
        <div className="flex-grow p-6 overflow-y-auto">
          {isLoading ? (
            <div>Loading messages...</div>
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map((message, index) => (
              <div
                key={index}
                ref={scroll}
                className={`flex ${
                  message.sender === user.userID
                    ? "justify-end"
                    : "justify-start"
                } mb-4`}
              >
                <div
                  className={`${
                    message.sender === user.userID
                      ? "bg-green-500 text-white self-end"
                      : "bg-blue-500 text-white self-start"
                  } py-2 px-4 rounded-lg max-w-md`}
                >
                  <div>{message.content}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No messages yet</div>
          )}
        </div>

        <div className="py-4 px-6 bg-gray-300">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex space-x-2"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow border border-gray-400 rounded-lg px-4 py-2 focus:outline-none"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default ChatComponent