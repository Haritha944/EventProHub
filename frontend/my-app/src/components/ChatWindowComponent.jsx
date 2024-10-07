import React, { useState,useEffect,useRef } from "react";



const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleString(undefined, options);
  };


const ChatWindowComponent = ({ selectedUser, messages=[], onSendMessage }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage({ content: message, receiver: selectedUser.id });
      setMessage("");   
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUser, messages]);

console.log("servicer",selectedUser?.id)


  return (
    <>
      <div className="w-3/4 h-full flex flex-col pt-28 px-5">
        <div className="bg-gray-300 rounded-md flex sticky top-28 ">
          
          <p className="my-4 mx-2 font-bold text-xl text-gray-800">
          Chat with  {selectedUser? selectedUser.name:"No user Selected"}
          </p>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 my-2 ${
                message.sender === selectedUser.id ? "text-left" : "text-right"
              }`}
            >
              <p
                className={`inline-block p-2 rounded-lg max-w-xs break-words ${
                  message.sender === selectedUser.id
                    ? "bg-blue-600 text-white"
                    : "bg-indigo-800 text-white font-normal"
                }`}
              >
                {message.content}
              </p>
              <p className="font-extralight text-sm">{formatTimestamp(message.timestamp)}</p>
            </div>
            ))}
        </div>
        <div ref={messagesEndRef}/>
        <div className="p-4 bg-gray-300 rounded-md flex-none flex sticky bottom-1">
          <input
            type="text"
            className="w-full p-2 border rounded-lg "
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
    
  </>
  )
}

export default ChatWindowComponent