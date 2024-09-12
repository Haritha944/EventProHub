import React,{useEffect,useState} from 'react'
import { useLocation,useNavigate } from 'react-router-dom';
import { useSelector,useDispatch} from 'react-redux';
import { setUserId,setUserName,setUserEmail,setToken} from '../redux/Slices/userSlice'; 
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const UserOrderStatusComponent = () => {
    const navigate=useNavigate()
    const dispatch = useDispatch();
    const location = useLocation();
    const queryParams= new URLSearchParams(location.search)
    const isPaymentCanceled = queryParams.get("canceled") === "true";
    const isSuccess = queryParams.get("success") === "true";
    const amount = queryParams.get("amount");
    const currency = queryParams.get("currency");
    const user = localStorage.getItem('userId'); 
    console.log("Userrrrr", user)
    const token = JSON.parse(localStorage.getItem('authToken'));
    const ttoken = token ? token.access : null;
    console.log("token", ttoken)
    
    
    const [userData, setUserData] = useState(null);

    useEffect(() => {
      
        if (isPaymentCanceled) {
          console.log("Payment canceled");
          
        } else if (isSuccess && amount && currency) {
          console.log("Payment successful");
          console.log("Amount:", amount);
          console.log("Currency:", currency);
          console.log('Access Token Object:', token);
          const fetchUserData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}services/paymentsucess/`, {
                    params: { price_paid: amount }
                    
                });
                    
                    // Extract user data from the response
                    const userData = response.data;
                    console.log(userData)
                    setUserData(response.data);
                    dispatch(setUserId(userData.id));

                     
                  } catch (error) {
                    console.error("Error fetching payment success data:", error);
                }
              }
          fetchUserData();    
        } else {
          console.log("Unexpected order status");
          
        }
      }, [isPaymentCanceled, isSuccess,amount,currency,dispatch]);
   
  return (
    <>
    <div className="text-center">
      {isPaymentCanceled && <h2>Order Canceled</h2>}
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <img
            src="https://i.pinimg.com/originals/32/b6/f2/32b6f2aeeb2d21c5a29382721cdc67f7.gif"
            alt="Payment Successful Animation"
            className="w-64 h-60"
          />
          <h2 className="text-2xl font-semibold text-blue-300 font-serif">
            Payment Successfully Completed
          </h2>
          <h2>Welcome, {userData ? userData.email : 'Guest'}</h2>
          <p className="mt-2 text-lg font-serif">
            Amount:Rs {amount} {currency}
          </p>
          <div className='flex space-x-4 mt-4'>
            <button
            onClick={() => navigate('/homepage')}
            className="mt-4 bg-green-700 font-serif text-white px-4 py-2 rounded-lg"
          >
            Go to Profile
          </button>
          </div>
        </div>
      ) : (
        <h2>Unexpected order status</h2>
      )}
      
    </div>
  
    </>
  )
}

export default UserOrderStatusComponent