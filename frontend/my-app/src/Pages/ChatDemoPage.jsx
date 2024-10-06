import React, { useEffect } from 'react'

const ChatDemoPage = () => {


    useEffect(()=>{
        console.log('Before WebSocket initialization.............///');
        const ws = new WebSocket(`ws://localhost:8000/ws/chat/2/10/user/servicer/`);
        console.log(ws)
        ws.onopen = () => { 
        console.log('WebSocket................./////');

        const message = {
            message: "Whats going",
            sender: 2, // Include sender ID
            receiver:10, // I
          };
          console.log("Sending message:", message); 
          ws.send(JSON.stringify(message));
          console.log("message sent..........")
        
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
   

    },[]);
  return (
    <div>ChatDemoPage</div>
  )
}

export default ChatDemoPage