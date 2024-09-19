import React,{useEffect, useState} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import myImage from '../Images/otp.jpg'


const BASE_URL = process.env.REACT_APP_BASE_URL;

function  UserOTPVerificationComponent  ()  {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [otp, setOtp] = useState();
    const email = localStorage.getItem('registered Email');

    console.log(otp)

 


    const submitHandler = async ()=>{
        try{
            const response= await fetch(`${BASE_URL}user/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            email:email,
            otp:otp,
        }),
    });
    if (response.ok){
        navigate('/login');
      
    
    }else{
        console.error('OTP veification failed')
    } 
   }
    catch (error){
        console.error('Error during OTP verification:', error);
    }
   
    };
  return (
    <section className='flex h-screen mx-auto mt-40 mr-3 md:pl-20'>
        <div className='md:w-1/3 max-w-sm h-full'>
         <img src={myImage} alt='description of img' className='w-full h-54 md:h-50 lg:h-96'/>
        </div>
        <div className='md:w-1/3 max-w-sm md:pl-20'>
        <div className='pb-5'>
            <h1 className='text-3xl mt-8 font-bold text-center text-orange-500'>Verify OTP </h1>
        </div>
        <input className='text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded'
           type="text" placeholder='OTP' value={otp} onChange={(e)=> setOtp(e.target.value)}/>

           <div className='text-center flex justify-center md:text-left'>
            <button className='mt-4 bg-cyan-700 text-white px-4 py-1 rounded' type="button"
            onClick={submitHandler}>
               Submit
            </button>

           </div>
        </div>
    </section>
  )
}

export default UserOTPVerificationComponent