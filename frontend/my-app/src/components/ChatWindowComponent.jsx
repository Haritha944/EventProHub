// import React, { useState,useEffect,useRef } from "react";



// const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     const options = {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return date.toLocaleString(undefined, options);
//   };


// const ChatWindowComponent = ({ selectedUser, messages=[], onSendMessage }) => {
//   const [message, setMessage] = useState("");
//   const messagesEndRef = useRef(null);
//   const handleInputChange = (e) => {
//     setMessage(e.target.value);
//   };

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       onSendMessage({ content: message, receiver: selectedUser.id });
//       setMessage("");   
//     }
//   };

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [selectedUser, messages]);

// console.log("servicer",selectedUser?.id)


//   return (
//     <>
//       <div className="w-3/4 h-full flex flex-col pt-28 px-5">
//         <div className="bg-gray-300 rounded-md flex sticky top-28 ">
          
//           <p className="my-4 mx-2 font-bold text-xl text-gray-800">
//           Chat with  {selectedUser? selectedUser.name:"No user Selected"}
//           </p>
//         </div>
//         <div className="flex-1 p-4 overflow-y-auto">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`p-2 my-2 ${
//                 message.sender === selectedUser.id ? "text-left" : "text-right"
//               }`}
//             >
//               <p
//                 className={`inline-block p-2 rounded-lg max-w-xs break-words ${
//                   message.sender === selectedUser.id
//                     ? "bg-blue-600 text-white"
//                     : "bg-indigo-800 text-white font-normal"
//                 }`}
//               >
//                 {message.content}
//               </p>
//               <p className="font-extralight text-sm">{formatTimestamp(message.timestamp)}</p>
//             </div>
//             ))}
//         </div>
//         <div ref={messagesEndRef}/>
//         <div className="p-4 bg-gray-300 rounded-md flex-none flex sticky bottom-1">
//           <input
//             type="text"
//             className="w-full p-2 border rounded-lg "
//             placeholder="Type a message..."
//             value={message}
//             onChange={handleInputChange}
//           />
//           <button
//             className="ml-2 p-2 bg-indigo-800 text-white rounded-lg"
//             onClick={handleSendMessage}
//           >
//             Send
//           </button>
//         </div>
//       </div>
    
//   </>
//   )
// }

// export default ChatWindowComponent







import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return "Invalid date"; // Handle missing or invalid timestamp
  }

  const isoFormat = timestamp
  
  const date = new Date(isoFormat);
  
  console.log("time", isoFormat);
  if (isNaN(date.getTime())) {
    return "Invalid date"; // Handle invalid date
  }
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    
  };
  return date.toLocaleString(undefined, options);
};


const ChatWindowComponent = ({ onSendMessage, conversationData, selectedUser }) => {
  const [message, setMessage] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const messagesEndRef = useRef(null);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedUser) {
      onSendMessage({ content: message, receiver: selectedUser.id });
      setMessage("");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUser, conversationData]);

  console.log("time", formatTimestamp("2024-10-08 11:53:55.862972+05:30"));
  console.log("Message Timestamp:", message.timestamp);
  console.log("Message :", message);
  return (
    <>
    {!selectedUser?(
      <div className="flex justify-center items-center w-full h-screen ">
      <p className="font-semibold text-gray-800 px-4 py-2 w-96 bg-gray-100 rounded-full">
        Choose someone to have a chat with and send and receive messages and connect with your clients on your palm
      </p>
      <img src="" alt="No user selected" />
    </div>
  ) : ( 
      <div className="w-3/4 h-full flex flex-col pt-4 px-5 bg-slate-100  rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-300 rounded-md flex sticky top-0 z-10">
          <p className="my-4 mx-2 font-bold text-xl text-gray-800">
            Chat with {selectedUser ? selectedUser.name : "No user Selected"}
          </p>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {conversationData.length > 0 ? (
            conversationData.map((message, index) => (
              <div
                key={index}
                className={`p-2 my-2 ${
                  message.sender_id === currentUser.id ? "text-left" : "text-right"
                }`}
              >
                <p
                  className={`inline-block p-2 rounded-lg max-w-xs break-words ${
                    message.sender_id === currentUser.id
                      ? "bg-blue-600 text-white"
                      : "bg-green-400 text-white font-normal"
                  }`}
                >
                  {message.message}
                </p>
                <p className="font-extralight text-sm">
                  {formatTimestamp(message.timestamp)}
                  
                </p>
              </div>
            ))
          ) : (
            <p>No messages yet</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-gray-300 rounded-md flex-none flex sticky bottom-1">
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Type a message..."
            value={message}
            onChange={handleInputChange}
          />
          <button
            className="ml-2 p-2 bg-indigo-800 text-white rounded-lg"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
  )}
    </>
  );
};

export default ChatWindowComponent;
