import React,{useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import {clearUser} from '../redux/Slices/userSlice';
import man from '../Images/man1.png';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import CollectionsIcon from '@mui/icons-material/Collections';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import LogoutIcon from '@mui/icons-material/Logout';
import BookIcon from '@mui/icons-material/Book';
import ChatIcon from '@mui/icons-material/Chat';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const BASE_URL = process.env.REACT_APP_BASE_URL;
function ServicerSidebarComponent  () {
  const navigate = useNavigate()
  const dispatch=useDispatch();
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChatVisibility = () => {
    setIsChatVisible((prev) => !prev);
  };

  const [servicerDetails,setServicerDetails] = useState(() =>{
    const savedServicerDetails = localStorage.getItem('servicerDetails');
    return savedServicerDetails ? JSON.parse(savedServicerDetails) : null;
  });

  const user = useSelector((state)=> state.user);
  const Token = useSelector((state)=> state.user.token);
  const accessToken = Token.access
  useEffect (() =>{
    const fetchServicerDetails = async ()=>{
      try {
         const response = await axios.get(`${BASE_URL}provider/servicer_profile/`,{
            headers: {
                        Authorization: `Bearer ${accessToken}`
         }
      });
      console.log('Owner Details:', response.data);
      setServicerDetails(response.data);
      localStorage.setItem('ownerDetails', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching owner details:', error);
  }
      };
      fetchServicerDetails();
    } ,[user]);


    const handleLogout = () =>{
      localStorage.removeItem('userName');
      localStorage.removeItem('servicerDetails');
      dispatch(clearUser());
      navigate('/servicelogin')
      
    }
  
  return (
    <>
    <div class="w-2/12 bg-gradient-to-r from-sky-500 to-blue-500 rounded p-3 shadow-lg">
          <div class="flex items-center space-x-4 p-2 mb-5">
              <img class="h-12 rounded-full" src={man} alt="James Bhatta"/>
              <div>
                  <h4 class="font-semibold text-lg text-rose-800 capitalize font-poppins tracking-wide">Hi,{servicerDetails ? servicerDetails.name : ''}</h4>
                  <span class="text-sm tracking-wide flex items-center space-x-1">
                      <VerifiedUserIcon className='text-green-800'/>
                      <span>Verified</span>
                  </span>
                 
              </div>
          </div>
          <ul class="space-y-2 text-sm">
              
              
              
              <li>
                  <a href="#" onClick={() => navigate('/servicerprofile')} class="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline">
                      <span class="text-gray-600">
                          <PersonIcon />
                      </span>
                      <span>My Profile</span>
                  </a>
              </li>
              <li>
                  <a href="#" onClick={() => navigate('/servicerdash')} class="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline">
                      <span class="text-gray-600">
                          <HomeIcon />
                      </span>
                      <span>Dashboard</span>
                  </a>
              </li>
              
              <li>
                  <a href="#" onClick={() => navigate('/servicecreate')} class="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline">
                      <span class="text-gray-600">
                        <CleaningServicesIcon/> 
                      </span>
                      <span>Service Creation </span>
                  </a>
              </li>
              <li>
                  <a onClick={() => navigate('/servicelist')} class="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline">
                      <span class="text-gray-600">
                          <CollectionsIcon />
                      </span>
                      <span>My Services</span>
                  </a>
              </li>
              <li>
                  <a  onClick={() => servicerDetails && navigate(`/servicerserviceapprove/${servicerDetails?.id}`)} class="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline">
                      <span class=" text-gray-600">
                         <BookIcon/>
                      </span>
                      <span>Bookings</span>
                  </a>
              </li>
              <li>
              <a onClick={() => navigate('/chat2')}  class="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline">
                      <span class="text-gray-600">
                         <ChatIcon/>
                      </span>
                      <span>Chats</span>
                  </a>  
                </li>
                <li>
                  <a  onClick={() => {
                if (servicerDetails) {
        const receiverId = servicerDetails.id; // Assuming this is your servicer ID
        const senderType = 'user'; // You can change this based on your logic
        
        // Navigate to the notification page with sender_id and sender_type as URL parameters
        navigate(`/notifications/${receiverId}/${senderType}`);
      }
    }} class="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline">
                      <span class=" text-gray-600">
                         <NotificationsActiveIcon/>
                      </span>
                      <span>Notification</span>
                  </a>
              </li>
              <li>
                  <a href="#" onClick={handleLogout} class="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline">
                      <span class="text-gray-600">
                          <LogoutIcon/>
                      </span>
                      <span>Logout</span>
                  </a>
              </li>
          </ul>
      </div>
   </>
  )
}

export default ServicerSidebarComponent