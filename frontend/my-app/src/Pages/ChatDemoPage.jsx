import React, {useState,useRef,useEffect } from 'react'
import { useSelector } from 'react-redux';
import Userlist from '../components/Userlist';
import ChatWindowComponent from '../components/ChatWindowComponent';
import { selectSelectedServices } from '../redux/Slices/userSlice'

const ChatDemoPage = () => {
     const [selectedServicer,setSelectedServicer]=useState(null);
     const [messages,setMessages]=useState([])
     const [messageContent, setMessageContent] = useState(''); 
     const ws=useRef(null);
     const { currentUser } = useSelector((state)=> state.user);
     const selectedService = useSelector(selectSelectedServices);
     const servicer=selectedService.servicer.id
     console.log("servicer",servicer)

     const handleServicerSelect = (servicer)=>{
       setSelectedServicer(servicer)
       if (currentUser){
       const senderId = currentUser.id;
       const senderType="user";
       const receiverType="servicer"
       const receiverId=servicer.id

        initializeWebSocket(senderId, receiverId, senderType, receiverType);
       }
     }


     const initializeWebSocket = (senderId, receiverId, senderType, receiverType) => {
      // Close existing WebSocket if it's already open
      if (ws.current) {
          ws.current.close();
      }

      console.log('Before WebSocket initialization.............///');
      ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${senderId}/${receiverId}/${senderType}/${receiverType}/`);

      ws.current.onopen = () => {
          console.log('WebSocket connection established................./////');
      };

      ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("Received message:", data);
          const normalizedMessage = {
            id: Date.now(),
            content: data.message,
            sender: data.sender,
            receiver: data.receiver,
            timestamp: new Date().toISOString()
        };

          setMessages((prevMessages) => [...prevMessages, data]); // Add received message to state
      };

      ws.current.onclose = () => {
          console.log('WebSocket connection closed');
      };
  };
  useEffect(() => {
    if (selectedServicer && currentUser) {
        const senderId = currentUser.id;
        const senderType = "user";
        const receiverId = selectedServicer.id;
        const receiverType = "servicer";

        // Initialize WebSocket with dynamic values
        initializeWebSocket(senderId, receiverId, senderType, receiverType);
    }

    // Clean up WebSocket on component unmount or when selectedServicer changes
    return () => {
        if (ws.current) {
            ws.current.close();
        }
    };
}, [selectedServicer, currentUser]);


const handleSendMessage = (messageContent) => {
  if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = {
          message: messageContent.content,
          sender: currentUser.id, // Use currentUser.id for dynamic sender ID
          receiver: selectedServicer ? selectedServicer.id : null, // Ensure receiver ID is set
      };

      ws.current.send(JSON.stringify(message));
      setMessageContent(''); // Clear input after sending
  } else {
      console.error("WebSocket is not connected or ready");
  }
};

   
    // ws.onmessage = (event) => {
    //     const message = JSON.parse(event.data);
    //     console.log("Message received:", message);

    //     const normalizedMessage = {
            
    //         content: message.message,
    //         sender: message.sender,
    //         receiver: 10,
    //         timestamp: new Date().toISOString()
    //     };

        
    // };
   

  
  return (
   <>
   <div>
   <div className="flex flex-col h-screen w-full">
   <div className="flex flex-1">
   <Userlist onSelectUser={handleServicerSelect}/>
   <div className="flex flex-col flex-1"></div>
   <ChatWindowComponent
        selectedUser={selectedServicer}
        messageContent={messageContent}
        onSendMessage={handleSendMessage}
        setMessageContent={setMessageContent}
      />
      </div>
      </div>
      </div>
   </>
  )
}

export default ChatDemoPage