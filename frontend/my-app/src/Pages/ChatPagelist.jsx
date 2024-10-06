import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Userlist from '../components/Userlist'
import { selectSelectedServices } from '../redux/Slices/userSlice'
import ChatWindowComponent from '../components/ChatWindowComponent'

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ChatPagelist = () => {
  const [selectedServicer, setSelectedServicer] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sender_id,setSenderid]=useState(null);
  const [receiver_id,setReceiverid]=useState(null);
  const [receiver_type,setReceivertype]=useState(null);
  const [sender_type,setSendertype]=useState(null);
  const { currentUser } = useSelector((state)=> state.user);
  const token = useSelector(state => state.user.token);
  const selectedService = useSelector(selectSelectedServices);
  

  const handleServicerSelect = async(servicer) => {
    setSelectedServicer(servicer);
    fetchMessages(servicer.id);
    if(!currentUser.is_servicer){
      
      const newSenderId = currentUser.id;
      const newReceiverId = servicer.id;

      localStorage.setItem('sender_id', newSenderId);
      localStorage.setItem('receiver_id', newReceiverId);
      localStorage.setItem('sender_type', 'user');
      localStorage.setItem('receiver_type', 'servicer')

      setSendertype('user');
      setSenderid(newSenderId);
      setReceivertype('servicer');
      setReceiverid(newReceiverId);
    

    const initializeWebSocket = () => {
    console.log('Before WebSocket initialization');
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${newSenderId}/${newReceiverId}/${sender_type}/${receiver_type}/`);
    
    setSocket(ws);
    console.log(ws)
    ws.onopen = () => { 
        console.log('WebSocket connected'); 
        
    }; 

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Message received:", message);

        const normalizedMessage = {
            id: Date.now(),
            content: message.message,
            sender: message.sender,
            receiver: newReceiverId,
            timestamp: new Date().toISOString()
        };

        setMessages((prevMessages) => [...prevMessages, normalizedMessage]);
    };

    ws.onclose = () => {
        console.log("WebSocket disconnected");
        
    };
  };
  initializeWebSocket();
    }
  };

  const fetchMessages = async (receiver_id) => {
    try{ const response = await axios.get(`${BASE_URL}chats/messages/${sender_id}/${receiver_id}/${sender_type}/${receiver_type}/`,{
         headers: {
          Authorization: `Bearer ${token.access}`  // Add Authorization header here
         }
   });
           setMessages(response.data);
     console.log(response.data, 'these are the messages');
   } catch (error) {
     console.error("Error fetching messages:", error);
 }
 };

  const handleSendMessage = (messageContent) => {
    if (socket?.readyState === WebSocket.OPEN) {
      const message = {
        message: messageContent,
        sender: sender_id, // Include sender ID
        receiver: receiver_id // I
      };

      socket.send(JSON.stringify(message));

    }else {
      console.error("WebSocket is not connected or ready");
    }
  };  

 
//   useEffect(() => {
//     const fetch_receivers = async () => {
//         if (sender_id) {
//             try {
//                 const response = await axios.get(`${BASE_URL}chats/chat/receivers/${sender_id}/`, {
//                     headers: {
//                         Authorization: `Bearer ${token.access}`
//                     }
//                 });
//                 setUsers(response.data.results);
//             } catch (error) {
//                 console.error("Error fetching receivers:", error);
//             }
//         }
//     };

//     fetch_receivers();
// }, [token]);

useEffect(() => {
  return () => {
    if (socket) {
      socket.close();
    }
  };
}, [socket]);

  return (
    <div>
      <div className="flex flex-col h-screen w-full">
      <div className="flex flex-1">
        <Userlist onSelectUser={handleServicerSelect}
        /> 
        <div className="flex flex-col flex-1">
          <ChatWindowComponent
            selectedUser={selectedServicer}
            messages={messages}
            onSendMessage={handleSendMessage} // Pass the handleSendMessage function as a prop
          />
        </div>
      </div>
      </div>
    </div>
  )
}

export default ChatPagelist

