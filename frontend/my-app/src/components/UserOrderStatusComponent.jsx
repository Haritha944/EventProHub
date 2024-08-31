import React,{useEffect} from 'react'
import { useLocation,useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser} from '../redux/Slices/userSlice'; 
import UserNavBarComponent from './UserNavBarComponent';
import UserFooterComponent from './UserFooterComponent';


const UserOrderStatusComponent = () => {
    const navigate=useNavigate()
    const location = useLocation();
    const queryParams= new URLSearchParams(location.search)
    const isPaymentCanceled = queryParams.get("canceled") === "true";
    const isSuccess = queryParams.get("success") === "true";
    const amount = queryParams.get("amount");
    const currency = queryParams.get("currency");
    const userName = useSelector(selectUser);

    
    useEffect(() => {
        if (isPaymentCanceled) {
          console.log("Payment canceled");
        } else if (isSuccess) {
          console.log("Payment successful");
          console.log("Amount:", amount);
          console.log("Currency:", currency);
        } else {
          console.log("Unexpected order status");
        }
      }, [isPaymentCanceled, isSuccess, amount, currency]);
    
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
          <button onClick={() => navigate('/userbooking')} className="mt-4  bg-blue-700 font-serif text-black px-4 py-2 rounded-lg">
             Go to Booking List
             </button>

            <button
            onClick={() => navigate('/userservice')}
            className="mt-4 bg-green-700 font-serif text-white px-4 py-2 rounded-lg"
          >
            Go to Services list
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