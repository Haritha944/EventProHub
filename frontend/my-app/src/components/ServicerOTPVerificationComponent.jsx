import React,{useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setOTP,verifyOTP } from '../redux/Slices/otpServicerSlice';
import servicer from '../Images/otp2.png'


function ServicerOTPVerificationComponent () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const otp=useSelector((state)=> state.otpServicer.otp);
    const verificationSuccess = useSelector((state)=>state.otpServicer.verificationSuccess)
    const email = localStorage.getItem('registeredEmail');
    const status = useSelector((state) => state.otpServicer.status);
    const error = useSelector((state) => state.otpServicer.error);

    console.log('OTP:', otp);
    console.log('Email:', email);


    const submitHandler = async () => {
      try {
        await dispatch(verifyOTP({ email, otp })).unwrap();
        if (verificationSuccess) {
          navigate('/servicelogin');
        }
      } catch (err) {
        console.error('Error during OTP verification:', err);
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
              onClick={submitHandler} disabled={status === 'loading'}
            >
              Submit
            </button> {status === 'failed' && <p>{error}</p>}
          </div>
          
        </div>
      </section>
    </>
  )
}

export default ServicerOTPVerificationComponent