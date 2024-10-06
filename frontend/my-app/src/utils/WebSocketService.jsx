// src/services/WebSocketService.js
import ReconnectingWebSocket from 'reconnecting-websocket';
import {store} from '../redux/store';
import { useSelector } from 'react-redux';
import { updateNewMessageIndicator } from '../redux/Slices/chatSlice';






class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.processedMessages = new Map();
    this.isProcessing = false;
    this.messageQueue = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000; // 5 seconds
  }
  
  connect(userId) {
    if (this.socket) {
      console.log('WebSocket already connected. Skipping reconnection.');
      console.log(userId)
      return;
    }

    const wsUrl = `ws://localhost:8000/ws/chat/${userId}/`;
    
    const options = {
      reconnectInterval: this.reconnectInterval,
      maxReconnectAttempts: this.maxReconnectAttempts,
    };

    this.socket = new ReconnectingWebSocket(wsUrl, [], options);
    
    this.socket.onopen = () => {
      console.log('WebSocket Connected');
      this.reconnectAttempts = 0;
    };
    
    this.socket.onclose = (event) => {
      console.log('WebSocket Disconnected:', event.code, event.reason);
      if (event.code === 1006) {
        console.log('Attempting to reconnect...');
      }
      this.handleReconnection();
    };
    
    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
    
    this.socket.onmessage = (e) => this.queueMessage(e);
  }

  handleReconnection() {
    this.reconnectAttempts++;
    if (this.reconnectAttempts <= this.maxReconnectAttempts) {
      console.log(`Reconnection attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts}`);
    } else {
      console.log('Max reconnection attempts reached. Please check your connection and try again later.');
      this.disconnect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  queueMessage(e) {
    this.messageQueue.push(e);
    this.processQueue();
  }

  processQueue() {
    if (this.isProcessing || this.messageQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const e = this.messageQueue.shift();
    this.handleMessage(e)
      .then(() => {
        this.isProcessing = false;
        this.processQueue();
      })
      .catch((error) => {
        console.error('Error processing message:', error);
        this.isProcessing = false;
        this.processQueue();
      });
  }

  async handleMessage(e) {
    console.log('Handling message:', e.data);
    try {
      const data = JSON.parse(e.data);
      console.log('Parsed message:', JSON.stringify(data, null, 2));
      
      const messageId = data.id || `${data.type}_${Date.now()}`;
      
      if (this.processedMessages.has(messageId)) {
        console.log('Duplicate message received, ignoring:', messageId);
        return;
      }
      
      this.processedMessages.set(messageId, Date.now());
      
      console.log('Processing message:', messageId);
      this.updateUIForNewMessage(data.booking_id);
      
      for (const [id, callback] of this.listeners) {
        console.log(`Calling listener: ${id}`);
        await callback(data);
      }
      
      this.cleanupProcessedMessages();
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }

  cleanupProcessedMessages() {
    const now = Date.now();
    for (const [id, timestamp] of this.processedMessages.entries()) {
      if (now - timestamp > 60000) { // Remove after 1 minute
        this.processedMessages.delete(id);
      }
    }
  }

  send(message) {
    // if (this.socket && this.socket.readyState === WebSocket.OPEN) {
    //   this.socket.send(JSON.stringify(message));
    // } else {
    //   console.error('WebSocket is not open. Unable to send message.');
    // }
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open. Queueing the message.');
      this.messageQueue.push(message);
  
      // Reinitialize WebSocket if it is null or not open
      if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
        this.connect(this.userId);  // Assuming userId is stored when connecting
      }
  
      // Ensure that 'onopen' is only set when the WebSocket is valid
      if (this.socket) {
        this.socket.onopen = () => {
          console.log('WebSocket connection opened. Sending queued messages.');
          while (this.messageQueue.length > 0) {
            const queuedMessage = this.messageQueue.shift();
            this.socket.send(JSON.stringify(queuedMessage));
          }
        };
      } else {
        console.error('Failed to initialize WebSocket for sending messages.');
      }
    }
  }

  addListener(id, callback) {
    console.log(`Adding listener: ${id}`);
    this.listeners.set(id, callback);
  }

  removeListener(id) {
    console.log(`Removing listener: ${id}`);
    this.listeners.delete(id);
  }

  updateUIForNewMessage(bookingId) {
    console.log('Updating UI for new message:', bookingId);
    store.dispatch(updateNewMessageIndicator(bookingId));
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
