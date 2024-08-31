import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setUserId,setUserEmail,setToken,setUserName } from '../redux/Slices/userSlice';
import axios from 'axios';
import login from '../Images/login3.png';

const BASE_URL =  process.env.REACT_APP_BASE_URL;
export const UserLoginComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const handleLogin = async()=>{
    try{
      console.log('BASE_URL:', BASE_URL); 
      
      const response = await fetch(`${BASE_URL}user/login/`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          email:email,
          password:password,
        }),

      });
      const data = await response.json();
      if (response.ok){
        console.log(data);
        console.log('success');
        localStorage.setItem('authToken',data.token);
        dispatch(setToken(data.token));
        dispatch(setUserId(data.user_id));
        console.log(data.token,"TOKENNNN")
        console.log(data.user_id,"Userrr")
        navigate('/userservice');
      }else {
        console.error(data);
      }
    } catch(error){
      console.error('Error during login:',error);
    }
  };
  
  return (
    <>
    <section className='flex h-screen mt-40 mr-3 md:pl-10 rounded-md'>
    <div className=" md:w-1/3 sm:w-full bg-cover bg-center  h-64 md:h-80 lg:h-96" style={{ backgroundImage: `url(${login})`,width:'550px' }}>
      </div>
      <div className='md:w-1/3 sm:w-full ml-10 '>
      <div className='pb-5'>
        <h1 className='text-3xl text-center font-bold ml-5'> USER LOGIN</h1>
      </div>
       <div className='pb-2'>
        <label className='text-sm font-semibold'>Email Address</label>
         <input
          className="text-sm w-full  px-3 py-2 border border-solid border-gray-300 rounded mt-2"
          type="text"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </div>
        <div className='pb-2'>
          <label className='text-sm font-semibold'>Password </label>
       <input
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </div>
        <div className="mt-4 flex justify-between font-semibold text-sm">
        
          <a
            className="text-blue-600 hover:text-blue-700 hover:underline hover:underline-offset-4"
            onClick={() => navigate('/request-reset')}
          >
            Forgot Password?
          </a>
        </div>
        <div className="text-center md:text-left">
          <button
            className="mt-4 bg-green-800 text-bold hover:bg-green-800 hover:text-black-800 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
            type="submit"
            onClick={handleLogin}

          >
            Login
          </button>
        </div>
        <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
          Don&apos;t have an account?{" "}
          <a
            className="text-red-600 hover:underline hover:underline-offset-4"
            href="#"
            onClick={() => navigate('/signup')}
          >
            Join Now
          </a>
          </div>
      </div>
    </section>
    </>
  )
}

export default UserLoginComponent;