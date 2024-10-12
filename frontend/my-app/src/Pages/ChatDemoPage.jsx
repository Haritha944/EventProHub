import React, {useState,useRef,useEffect } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import Userlist from '../components/Userlist';
import ChatWindowComponent from '../components/ChatWindowComponent';
import { selectSelectedServices } from '../redux/Slices/userSlice'


const BASE_URL =  process.env.REACT_APP_BASE_URL;
const ChatDemoPage = () => {
     const [selectedServicer,setSelectedServicer]=useState(null);
     const [messages,setMessages]=useState([]);
     const [conversationData, setConversationData] = useState([])
     const [messageContent, setMessageContent] = useState(''); 
     const [searchQuery, setSearchQuery] = useState('');
     const [searchResults, setSearchResults] = useState([]);
     const [receivers, setReceivers] = useState([]); 
     const ws=useRef(null);
     const [notifications, setNotifications] = useState([]);
     const { currentUser } = useSelector((state)=> state.user);
     const selectedService = useSelector(selectSelectedServices);
     const servicer=selectedService.servicer.id
     const Token = useSelector(state => state.user.token);
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


    //  console.log(servicer)

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
          setConversationData((prev)=> [...prev, data]);
          console.log(event.data)
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
        fetchMessages(senderId,senderType,receiverId,receiverType)
    }

    // Clean up WebSocket on component unmount or when selectedServicer changes
    return () => {
        if (ws.current) {
            ws.current.close();
        }
    };
}, [selectedServicer, currentUser]);

console.log(selectSelectedServices)

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


   const fetchMessages = async(senderId,senderType,receiverId,receiverType)=>{
    try{
        const response =  await axios.get(`${BASE_URL}chats/messages/${senderId}/${receiverId}/${senderType}/${receiverType}/`,{
            headers:{
                Authorization:`Bearer ${Token.access}`
            }
        });
        setConversationData(response.data);
        console.log('Fetched messages',response.data)
    }catch(error){
      console.error("Error fetching messages:",error)
    }
   }
    
   console.log(conversationData)
   useEffect(() => {
    const fetchReceivers = async () => {
        if (Token && Token.access) {
            try {
                const senderId = currentUser.id;
                const senderType="user" // Use currentUser.id as sender ID
                const response = await axios.get(`${BASE_URL}chats/chat/receivers/${senderId}/${senderType}/`, {
                    headers: {
                        Authorization: `Bearer ${Token.access}`,
                    },
                });
                setReceivers(response.data);
            } catch (error) {
                console.error("Error fetching receivers:", error);
            }
        }
    };

    fetchReceivers();
}, [currentUser, Token]); 
   
const handleSearch = async (query) => {
    setSearchQuery(query);
    console.log(query, 'from chatpage');
  
    if (query.trim() === '') {
        setSearchResults([]);
        return;
    }
  
    try {
        const response = await axios.get(`${BASE_URL}chats/servicer-search/?search=${query}`);
        console.log(response.data, 'response from the api search');
        setSearchResults(response.data);
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
  };
  
  return (
   <>
   <div>
   <div className="flex flex-col h-screen w-full">
   <div className="flex flex-1">
   <Userlist receivers={receivers}
   searchResults={searchResults}
   searchQuery={searchQuery}
   onSearch={(query) => console.log(query)} 
   onSelectUser={handleServicerSelect}/>

   <div className="flex flex-col flex-1"></div>
   <ChatWindowComponent
        selectedUser={selectedServicer}
        messageContent={messageContent}
        conversationData={conversationData}
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