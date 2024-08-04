import React,{useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setOTP,setVerificationSuccess,clearOTP } from '../redux/Slices/otpSlice';
import servicer from '../Images/otp2.png'

function ServicerOTPVerificationComponent () {
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
            const response= await fetch('http://127.0.0.1:8000/api/provider/verify/', {
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
        navigate('/servicelogin');
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
    <>
      <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
        <div className="md:w-1/3 max-w-sm mt-10">
          <img
            src={servicer}
            alt="Sample image"
          />
        </div>
        <div className="md:w-1/3 max-w-sm">
          <div className="pb-5">
            <h1 className="text-3xl text-blue-600 font-bold">Verify OTP</h1>
            <h5 className='mt-2'>Send to your Email-id</h5>
          </div>
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => dispatch(setOTP(e.target.value))}
          />
          <div className="text-center md:text-left">
            <button
              className="mt-4 bg-blue-600 text-bold hover:bg-white hover:text-blue-500 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
              type="button"
              onClick={submitHandler}
            >
              Submit
            </button>
          </div>
          
        </div>
      </section>
    </>
  )
}

export default ServicerOTPVerificationComponent