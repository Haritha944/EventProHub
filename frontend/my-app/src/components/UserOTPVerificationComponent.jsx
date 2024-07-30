import React,{useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setOTP,setVerificationSuccess,clearOTP } from '../redux/Slices/otpSlice';
import myImage from '../Images/otp.jpg'

function  UserOTPVerificationComponent  ()  {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const otp=useSelector((state)=> state.otp.otp);
    const verificationSuccess = useSelector((state)=>state.otp.verificationSuccess)
    const email = localStorage.getItem('registered Email');

    useEffect(() => {
       
        dispatch(clearOTP());
    }, [dispatch]);


    const submitHandler = async ()=>{
        try{
            const response= await fetch('http://127.0.0.1:8000/api/user/verify/', {
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
        dispatch(setVerificationSuccess(true));
        navigate('/login');
        dispatch(clearOTP());
    
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
           type="text" placeholder='OTP' value={otp} onChange={(e)=>dispatch(setOTP(e.target.value))}/>

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