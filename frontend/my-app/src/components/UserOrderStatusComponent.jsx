import React,{useEffect,useState} from 'react'
import { useLocation,useNavigate } from 'react-router-dom';
import { useSelector ,useDispatch} from 'react-redux';
import { selectUser,setUserName} from '../redux/Slices/userSlice'; 
import axios from 'axios';
import UserNavBarComponent from './UserNavBarComponent';
import UserFooterComponent from './UserFooterComponent';

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
    const userName = useSelector(selectUser);
    const token = useSelector(state => state.user.token); 
    const accessToken = token?.access;
    const [userData, setUserData] = useState(null);

    useEffect(() => {
      
        if (isPaymentCanceled) {
          console.log("Payment canceled");
        } else if (isSuccess) {
          console.log("Payment successful");
          console.log("Amount:", amount);
          console.log("Currency:", currency);
          const fetchUserData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}services/paymentsucess/`, {
                    params: { price_paid: amount }
                });
                setUserData(response.data);
                
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserData();
        } else {
          console.log("Unexpected order status");
        }
      }, [isPaymentCanceled, isSuccess, amount,currency]);
   console.log(accessToken) 
  return (
    <>
   <UserNavBarComponent/>
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
          <h2>Welcome, {userName}</h2>
          <p className="mt-2 text-lg font-serif">
            Amount:Rs {amount} {currency}
          </p>
          <div className='flex space-x-4 mt-4'>
            <button
            onClick={() => navigate('/homepage')}
            className="mt-4 bg-green-700 font-serif text-white px-4 py-2 rounded-lg"
          >
            Go to Home
          </button>
          </div>
        </div>
      ) : (
        <h2>Unexpected order status</h2>
      )}
      
    </div>
    <UserFooterComponent/>
    </>
  )
}

export default UserOrderStatusComponent