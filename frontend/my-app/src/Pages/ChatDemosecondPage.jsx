import React,{useRef,useState,useEffect} from 'react'
import axios from 'axios';
import Servicersidelist from '../components/Servicersidelist';
import ChatServicerWindowComponent from '../components/ChatServicerWindowComponent';
import { selectSelectedServices } from '../redux/Slices/userSlice'
import { useSelector } from 'react-redux';


const BASE_URL =  process.env.REACT_APP_BASE_URL;
const ChatDemosecondPage = () => {
    const [selectedServicer,setSelectedServicer]=useState(null);
    const [messages,setMessages]=useState([]);
    const [conversationData, setConversationData] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [messageContent, setMessageContent] = useState(''); 
    const [receivers, setReceivers] = useState([]); 
    const ws=useRef(null);
    const { currentUser } = useSelector((state)=> state.user);
    const [servicerDetails, setServicerDetails] = useState(() => {
        const savedServicerDetails = localStorage.getItem('servicerDetails');
        const parsedDetails = savedServicerDetails ? JSON.parse(savedServicerDetails) : null;
        
        // Log the retrieved servicerDetails
        console.log(parsedDetails);
        
        return parsedDetails;
      });
    const servicerId = servicerDetails ? servicerDetails.id : null;
    console.log('Servicer ID:', servicerId);
        
    const Token = useSelector(state => state.user.token);
    //console.log("servicer",servicer)

    const handleServicerSelect = (user)=>{
      setSelectedServicer(user)
      
      if (!currentUser){
      const senderId = servicerId;
      const senderType="servicer";
      const receiverType="user"
      const receiverId=user.id
     
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
   if (selectedServicer && !currentUser) {
       const senderId = servicerId;
       const senderType = "servicer";
       const receiverId = selectedServicer.id;
       const receiverType = "user";
       
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
         sender: servicerId, // Use currentUser.id for dynamic sender ID
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
       const response =  await axios.get(`${BASE_URL}chats/messages/${senderId}/${receiverId}/${senderType}/${receiverType}/`);
       setConversationData(response.data);
       console.log('Fetched messages',response.data)
   }catch(error){
     console.error("Error fetching messages:",error)
   }
  }
   
 console.log(conversationData)

  useEffect(() => {
   const fetchReceivers = async () => {
       
           try {
               const senderId = servicerId; // Use currentUser.id as sender ID
               const response = await axios.get(`${BASE_URL}chats/chat/receivers/${senderId}/`);
               setReceivers(response.data);
           } catch (error) {
               console.error("Error fetching receivers:", error);
           }
       
   };

   fetchReceivers();
}, [servicerId]); 
  
const handleSearch = async (query) => {
  setSearchQuery(query);
  console.log(query, 'from chatpage');

  if (query.trim() === '') {
      setSearchResults([]);
      return;
  }

  try {
      const response = await axios.get(`${BASE_URL}chats/user-search/?search=${query}`);
      console.log(response.data, 'response from the api search');
      setSearchResults(response.data);
  } catch (error) {
      console.error("Error fetching search results:", error);
  }
};
  return (
    <>
   
      <div className="flex flex-col h-screen w-full">
      <div className="flex flex-1">

        <Servicersidelist receivers={receivers}
        searchResults={searchResults}
        searchQuery={searchQuery}
        onSearch={(query) => console.log(query)} // Replace with actual search logic
        onSelectUser={handleServicerSelect} 
       
       /> 
    <div className="flex flex-col flex-1"></div>
   <ChatServicerWindowComponent
        selectedUser={selectedServicer}
        messageContent={messageContent}
        conversationData={conversationData}
        onSendMessage={handleSendMessage}
        setMessageContent={setMessageContent}
      />
      </div>
    </div>
    </>
  )
}

export default ChatDemosecondPage