import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import UserNavBarComponent from './UserNavBarComponent';
import UserFooterComponent from './UserFooterComponent';


const BASE_URL = process.env.REACT_APP_BASE_URL;
const UserNotificationComponent = () => {
    const { receiverId, senderType } = useParams();
    const [notifications, setNotifications] = useState([]);
    const navigate=useNavigate()
    
    useEffect(() => {
        const fetchNotifications = async () => {
          try {
            const response = await axios.get(`${BASE_URL}chats/notifications/${receiverId}/${senderType}/`);
            setNotifications(response.data);
          } catch (error) {
            console.error('Error fetching notifications:', error);
          }
        };
    
        fetchNotifications();
      }, [receiverId, senderType]);

      const markAsRead = async (id) => {
        
        console.log("ID passed to markAsRead:", id); 
        try {
          const response=await axios.get(`${BASE_URL}chats/notifications/${id}/update/`);
          if (response.status === 200) {
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
              notification.id === id ? { ...notification, is_read: true } : notification
            )
          );
        } }
        catch (error) {
            
          console.error('Error marking notification as read:',  error.response ? error.response.data : error.message);
        }
      };
      console.log("Notifications:", notifications);
  return (
    <div>
        <UserNavBarComponent/>
        <div class="flex flex-wrap bg-gray-100 w-full h-screen mt-20">
            <div className='w-1/4 p-5'>
        <h2 className="text-xl text-blue-600 font-bold mb-4 mt-5">Sidebar</h2>
      <ul class="space-y-2 text-sm">
      <li>
                  <a  onClick={() => navigate('/userbookings')} class="flex items-center space-x-1 text-emerald-700 p-2 rounded-md font-medium hover:bg-sky-200 focus:bg-sky-200 focus:shadow-outline">
                      <span class="text-teal-600">
                          <PersonIcon />
                      </span>
                      <span>My Bookings</span>
                  </a>
              </li>
        </ul>
        </div>
        <div className='w-9/12 flex-grow'>
      <h2 className='text-3xl font-bold text-green-500 text-center mb-5 mt-10'>Notifications</h2>
      {notifications.length === 0 ? (
        <p className='text-red-600 text-center'>No notifications found.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className={`p-4 mx-4 border rounded shadow ${
                notification.is_read ? "bg-gray-200" : "bg-blue-100 border-yellow-100"
              }`}>
              <strong className='text-red-800'>{notification.sender_type === 'user' ? notification.user.name : notification.servicer.name}: </strong>
              <p className='mt-6'>
      {/* Show different icons based on the is_read status */}
      {notification.is_read ? (
        <NotificationsIcon className="inline-block h-5 w-5 text-gray-500 mr-2" /> // Icon for read notification
      ) : (
        <NotificationsActiveRoundedIcon className="inline-block h-5 w-5 text-yellow-500 mr-2" /> // Icon for unread notification
      )}
      
      {notification.message}
               </p>
              <br />
              <small>{new Date(notification.timestamp).toLocaleString()}</small>
              {!notification.is_read && (
           <button onClick={() => 
            markAsRead(notification.id)
        } className="ml-2 bg-blue-700 px-2 py-3 rounded-full">
            Mark as Read
        </button>
          )}
            </li>
          ))}
        </ul>
      )}
      </div>
      </div>
      <UserFooterComponent/>
    </div>
  )
}

export default UserNotificationComponent