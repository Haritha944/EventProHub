import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function UserProfileComponent() {
    const navigate=useNavigate()
    const [userDetails, setUserDetails] = useState(() => {
      const savedUserDetails = localStorage.getItem('userDetails');
      return savedUserDetails ? JSON.parse(savedUserDetails) : null;
    });
    
    const [showModal, setShowModal] = useState(false);
    const [confirmUpdate, setConfirmUpdate] = useState(false);

    const user = useSelector((state) => state.user);
    const Token = useSelector(state => state.user.token);
    const accessToken = Token.access
    console.log(Token)
    console.log(accessToken)

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}user/user-profile/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}` // Include access token in the Authorization header
                    }
                });
                console.log('User Details:', response.data);
                setUserDetails(response.data);
                localStorage.setItem('userDetails', JSON.stringify(response.data));

            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchUserDetails();
        
    }, [user]);

    const updateUserProfile = async () => {
      try {
        const response = await axios.put(`${BASE_URL}user/user-profile/update/`, userDetails, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log('Updated User Details:', response.data);
        localStorage.setItem('userDetails', JSON.stringify(response.data));
        setUserDetails(response.data);
        setConfirmUpdate(false);
        setShowModal(false);
      } catch (error) {
        console.error('Error updating user details:', error);
      }
    };
  
    useEffect(() => {
      if (confirmUpdate) {
        updateUserProfile();
      }
    }, [confirmUpdate]);

    useEffect(()=>{
      window.scrollTo(0,0);
    },[]);
  return (
    <div className="flex mt-32 h-full">
      <div className='sm:w-1/4 md:w-1/4 p-4 bg-gray-100 min-h-screen text-blue-700 shadow-md'>
      <div className='items-center space-x-4 p-2 mb-5'>
      <h2 className="text-xl font-bold mb-4">Sidebar</h2>
      <ul class="space-y-2 text-sm">
      <li>
                  <a  onClick={() => navigate('/userbookings')} class="flex items-center space-x-1 text-emerald-700 p-2 rounded-md font-medium hover:bg-sky-200 focus:bg-sky-200 focus:shadow-outline">
                      <span class="text-teal-600">
                          <PersonIcon />
                      </span>
                      <span>My Bookings</span>
                  </a>
              </li>
              <li>
             <a onClick={() => {
                if (userDetails) {
        const receiverId = userDetails.id; // Assuming this is your servicer ID
        const senderType = 'servicer'; // You can change this based on your logic
        
        // Navigate to the notification page with sender_id and sender_type as URL parameters
        navigate(`/notification/${receiverId}/${senderType}`);
      }
    }} class="flex items-center space-x-3 text-emerald-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline">
                      <span className=" text-emerald-700">
                         <NotificationsActiveIcon/>
                      </span>
                      <span > Notification</span></a>
              </li>
        </ul>
        </div>
      </div>
      <div className="w-3/4 md:w-3/5 p-8 bg-white shadow-md">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-5"> <AccountCircleIcon className="mr-2" fontSize="large" />Profile Details</h1>
       
        <div className="rounded shadow p-6">
          
          
          <div className="flex">
           
            <span className="text-pink-600">Feel Free to Edit Your Details!!</span>
          </div>

         
          <div className="pb-6 mt-10">
            <label htmlFor="name" className="font-semibold text-gray-700 block pb-1">Name</label>
            <div className="flex">
              <input
                id="username"
                className="border-gray-300 border rounded-r px-4 py-2 w-full"
                type="text"
                value={userDetails ? userDetails.name : ''}
                onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
              />
            </div>
          </div>
          <div className="pb-4">
            <label htmlFor="about" className="font-semibold text-gray-700 block pb-1">Email</label>
            <input
              id="email"
              className="border border-gray-300 rounded-r px-4 py-2 w-full bg-gray-200 text-gray-500 cursor-not-allowed"
              type="email"
              value={userDetails ? userDetails.email : ''}
              readOnly
            />
          </div>
          <div className="pb-4">
            <label htmlFor="about" className="font-semibold text-gray-700 block pb-1">Phone Number</label>
            <input
              id="number"
              className="border border-gray-300 rounded-r px-4 py-2 w-full"
              type="text"
              value={userDetails ? userDetails.phone_number : ''}
              onChange={(e) => setUserDetails({ ...userDetails, phone_number: e.target.value })}
            />
          </div>
          <button
            onClick={() => {
              setShowModal(true);
              setConfirmUpdate(false);
            }}
            className="mt-2 text-md font-bold  text-white bg-green-800 rounded-full px-5 py-2 hover:bg-gray-800"
            type="button">
            Save Changes
          </button>
           
          {showModal && (
          <div id="popup-modal" tabindex="-1" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
              <div className="relative p-4 w-full max-w-md max-h-full">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                      <div className="p-4 md:p-5 text-center">
                          <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                          </svg>
                          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to Edit?</h3>
                          <button 
                          onClick={() => {
                            setConfirmUpdate(true);
                            setShowModal(false);
                          }}
                          data-modal-hide="popup-modal" 
                          type="button" 
                          className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                              Yes, I'm sure
                          </button>
                          <button onClick={() => setShowModal(false)} data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
                      </div>
                  </div>
              </div>
          </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default UserProfileComponent;