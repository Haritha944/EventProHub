import React,{useRef,useEffect} from 'react'

const ChatDemosecondPage = () => {
    const ws = useRef(null);
    
    useEffect(()=>{
        console.log("Before websocket initialised...................")
        ws.current=new WebSocket(`ws://localhost:8000/ws/chat/2/10/user/servicer/`)
        ws.current.onopen=()=>{
            console.log("Websocket connection established........")
        }
        ws.current.onmessage=(event)=>{
            const data = JSON.parse(event.data);
            console.log("Received messages",data)
        }
        ws.current.onclose = ()=>{
            console.log("Websocket connection failed")
        }
        return ()=>{
            if(ws.current){
                ws.current.close()
            }
        }

    },[])

    const sendMessage =()=>{
        if(ws.current && ws.current.readyState === WebSocket.OPEN){
            const message={
                message:"I have a query about your service",
                sender:2,
                receiver:10,
            };
            console.log("Sending message",message);
            ws.current.send(JSON.stringify(message));
            console.log("Message sent")
        } else{
            console.log("Webscoket is not open or ready")
        }
    }
  return (
    <>
    <div className='bg-red-200'>ChatDemosecondPage</div>
    <h1 className='text-blue-700'>Chat Demo</h1>
    <button onClick={sendMessage}>Send Message</button>
    </>
  )
}

export default ChatDemosecondPage