import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Images/logo.png';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import LogoutIcon from '@mui/icons-material/Logout';


function AdminSidebarComponent  ()  {

    const navigate=useNavigate()
    const handleLogout = ()=>{
        localStorage.removeItem('adminToken'); 
        navigate('/adminlogin');
    };
  return (
    <>
  <div className='sidebar d-flex flex-column h-screen p-4 w-full sm:w-1/6 md:w-1/6 lg:w-1/6 bg-gray-100'>
    <div className='flex items-center mb-3 whitespace-nowrap'>
        <img src={logo} alt="Event" className='inline-flex items-center justify-center h-10 w-10 mr-2'/>
        <span className='text-xl font-bold text-blue-400'>Servicelink Pro</span>
    </div>
    <ul class="flex flex-col py-4">
      <li>
        <a href="#" class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-indigo-400"> <HomeIcon className="me-2" /></span>
          <span class="text-sm font-medium text-pink-400">Dashboard</span>
        </a>
      </li>
      <li>
        <a href="#" onClick={() => navigate('/adminuserlist')}  class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-indigo-400"><PersonIcon className="me-2" /></span>
          <span class="text-sm font-medium text-pink-400">Customers</span>
        </a>
      </li>
      <li>
        <a href="#" onClick={() => navigate('/adminservicerlist')} class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-indigo-400"><SupervisedUserCircleIcon className="me-2" /></span>
          <span class="text-sm font-medium text-pink-400">Servicers</span>
        </a>
      </li>
      <li>
        <a href="#" onClick={() => navigate('/adminservicelist')}  class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-indigo-400"><CleaningServicesIcon className="me-2" /></span>
          <span class="text-sm font-medium  text-pink-400">Services</span>
        </a>
      </li>
      <li>
        <a href="#" onClick={() => navigate('/adminsubscription')}  class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-indigo-400"><AssessmentIcon className="me-2" /></span>
          <span class="text-sm font-medium  text-pink-400">Subscription Creation </span>
        </a>
      </li>
       <li>
        <a href="#" onClick={() => navigate('/adminsubscriplist')}class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-indigo-400"><ShoppingCartCheckoutIcon className="me-2" /></span>
          <span class="text-sm font-medium  text-pink-400">Subscriptions</span>
        </a>
      </li>
      <li>
        <a href="#" onClick={handleLogout} class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800">
          <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-indigo-400"><LogoutIcon className="me-2" /></span>
          <span class="text-sm font-medium  text-pink-400">Logout</span>
        </a>
      </li>
    </ul>
  </div>

        
    </>
  )
}

export default AdminSidebarComponent