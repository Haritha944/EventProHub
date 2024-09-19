import React,{ useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import servicer from '../Images/otp2.png'
import { removeServicer } from '../redux/Slices/servicerSlice';

const BASE_URL = process.env.REACT_APP_BASE_URL;
function ServicerOTPVerificationComponent () {
    const [otp, setOtp] = useState();
    const [status, setStatus] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentServicer } = useSelector((state)=> state.servicer);
    console.log(currentServicer.user.email)
    console.log("😂😂😊😊😊😊😁😁")


    const handleVerifyOtp = async()=>{
      try {
        const response = await fetch(`${BASE_URL}provider/verify/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: currentServicer.user.email, otp: otp }),
        });
  
        if (!response.ok) {
          const errorData = await response.json(); 
          console.error('OTP verification failed:', errorData);
          setError(true)
          setStatus("Error occured")
          throw new Error(errorData.message || 'OTP verification failed');
          
        }
        
        dispatch(removeServicer());
        navigate('/servicelogin');
      } catch (error) {
        console.log(error)
      }
    }




  
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
            onChange={(e) => setOtp(e.target.value)}
          />
          <div className="text-center md:text-left">
            <button
              className="mt-4 bg-blue-600 text-bold hover:bg-white hover:text-blue-500 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
              type="button"
              onClick={handleVerifyOtp} disabled={status === 'loading'}
            >
              Submit
            </button> <p>{error && "An error occured while verification"}</p>
          </div>
          
        </div>
      </section>
    </>
  )
}

export default ServicerOTPVerificationComponent