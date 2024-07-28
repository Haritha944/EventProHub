import React,  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import eventlogo from '../Images/Eventpro hub (1).png'

export const UserNavBarComponent = () => {
    const navigate = useNavigate();
    const [userName,setUserName]=useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const Token = useSelector(state => state.user.token);
    const accessToken = Token.access;
    useEffect(()=>{
        const fetchUserName =  async ()=>{
            try{
                const response =  await axios.get('http://127.0.0.1:8000/api/user/user-navbar/',{
                    headers:{
                        Authorization:`Bearer ${accessToken}`
                    }
                });
                setUserName(response.data.name);
                setLoggedIn(true);
            }
            catch (error) {
                console.error('Error fetching user details:', error);
                setLoggedIn(false);
              }
        };
        if (Token) {
            fetchUserName();
        }
    }, [accessToken]);
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
      };
    const handleLogout = async () =>{
        try{
        localStorage.removeItem('userName');
        localStorage.removeItem('userDetails');
        setUserName('');
        setLoggedIn(false);
        setDropdownOpen(false);
        localStorage.removeItem('authToken');
        navigate('/homepage');

        }
        catch (error){
            console.error('Error logging out:',error);
        }
    };
    
  

return (
    <>
    <nav className='fixed w-full z-20 top-0 start-0 border-b border-gray-200 bg-gray-100'>
    <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
    <a href="#"  className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={eventlogo} className="h-20" alt="Flowbite Logo" />
            <span onClick={() => navigate('/homepage')} className="self-center text-2xl font-semibold whitespace-nowrap dark:text-dark">EVENTPRO HUB</span>
          </a>  
    <div className='flex bg-white md:space-0' >
        <button onClick={()=>navigate('/servicerlogin')} type="submit"className="mr-2 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-2 py-2 text-center ">Become a Servicer</button>
        {loggedIn ? (
          <div className='relative'>
            <button onClick={toggleDropdown} className='text-white bg-red-700 hover:bg-red-900 rounded-lg text-sm px-2 py-2 text-center'>
                {`Hi,${userName}`}
            </button>
            {dropdownOpen && (
                  <ul className="absolute top-full mt-1 bg-red-700 rounded-lg shadow-lg">
                    <li>
                      <button onClick={() => navigate('/userprofile')} className="block px-8 py-2 text-white hover:bg-blue-800 font-medium rounded-lg text-sm w-full text-left">Profile</button>
                    </li>
                    <li>
                      <button onClick={() => navigate('/userbooking')} className="block px-8 py-2 text-white hover:bg-blue-800 font-medium rounded-lg text-sm w-full text-left">Bookings</button>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="block px-8 py-2 text-white hover:bg-blue-800 font-medium rounded-lg text-sm w-full text-left">Logout</button>
                    </li>
                  </ul>
                )}
                 </div>
        ):(
            <button onClick={() => navigate('/signup')} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 ">Login/Register</button>
        )}
         <button onClick={() => navigate('/admin')} type="button" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 ml-2">
        Admin
      </button>

        <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100  dark:text-gray-400 dark:hover:bg-gray-700" aria-controls="navbar-sticky" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
    </div>
    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-gray-100">
              <li>
                <a href="#" onClick={() => navigate('/homepage')} className="block py-2 px-3 text-gray-900 rounded md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">Home</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">Profile</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">About Us</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>

    </nav>
    </>
  );
};
export default UserNavBarComponent;