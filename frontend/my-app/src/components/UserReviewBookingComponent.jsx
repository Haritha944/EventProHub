import React ,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import { selectToken,selectSelectedServices,selectUserId } from '../redux/Slices/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const BASE_URL = process.env.REACT_APP_BASE_URL;

function UserReviewBookingComponent () {
  const user = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const serviceDetails = useSelector(selectSelectedServices);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();
  
  
  
  const [bookingDetails, setBookingDetails] = useState({
    service_date: '',
    service_time: '',
    address: '',
    city: '',
    zip_code: '',
    instructions: '',
    area_sqft: '',
   
});

const handleBookingSubmit = async (e) => {
  e.preventDefault();
  const serviceId = serviceDetails.id;  
  const servicerId = serviceDetails?.servicer?.id;
  const userId = user;  
  
  const selectedTime = bookingDetails.service_time;
  const startTime = "09:00";
  const endTime = "18:00";
  if (selectedTime < startTime || selectedTime > endTime) {
    setError('Service time must be between 9:00 AM and 6:00 PM.');
    setOpenSnackbar(true);
    return;
  }
 
  
  try {
      const formData = new FormData();
      formData.append('service_date', bookingDetails.service_date);
      formData.append('service_time', bookingDetails.service_time);
      formData.append('address', bookingDetails.address);
      formData.append('city', bookingDetails.city);
      formData.append('zip_code', bookingDetails.zip_code);
      formData.append('instructions', bookingDetails.instructions);
      formData.append('area_sqft', bookingDetails.area_sqft);
      

      // Append static fields
      formData.append('service', serviceId);  // Get service name from state
      formData.append('servicer', servicerId);  // Assuming servicer name is part of service
      formData.append('user', user);

      const response = await axios.post(`${BASE_URL}services/bookings/`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token.access}`,
          },
      });
      const bookingId = response.data.id;
      await handlePayment(bookingId);
      console.log('Booking ID:',bookingId);
      

  } catch (error) {
      console.error('Error booking service:', error);
      alert('There was an error booking the service. Please try again.');
  }
};
const handlePayment = async (bookingId) => {
  try {
    const stripe = await stripePromise;
    console.log('Stripe instance:', stripe);
    const token = localStorage.getItem("token");
    const paymentResponse = await axios.post(`${BASE_URL}payments/createcheckoutsession/`, { servicebooking_id: bookingId }, {
      
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (paymentResponse.data.error) {
      console.error("Error creating checkout session:", paymentResponse.data.error);}
    else{
    const { session_id } = paymentResponse.data;
    const {error} = await stripe.redirectToCheckout({sessionId: session_id});
    }
    if (error) {
      console.error('Error during payment:', error);
      setError(error);
      setOpenSnackbar(true);
    }
  } catch (error) {
    console.error('Payment failed:', error);
    alert('There was an error processing the payment. Please try again.');
  }
};
const handleInputChange = (e, field) => {
  setBookingDetails({
      ...bookingDetails,
      [field]: e.target.value,
  });
};
const handleCloseSnackbar = () => {
  setOpenSnackbar(false);
};

console.log('Stripe API Key:', stripePromise);

return (
    <>
    <div className='relative w-full min-h-screen flex flex-col lg:flex-row mb-6'>
    <div  className="w-full lg:w-1/2 max-w-lg p-4 bg-white shadow-lg rounded-lg mx-4 lg:mx-20 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Book This Service</h2>
      {serviceDetails && (
          <div className="mb-6">
            <div className='flex flex-col md:flex-row items-center'>
                          <img 
                            className="w-20 h-20 rounded-lg shadow-lg" 
                            src={`http://127.0.0.1:8000${serviceDetails.images}`} 
                            alt={`${serviceDetails.name} - ${serviceDetails.city}`} 
                        />
            <h3 className="text-xl font-semibold mx-0 md:mx-5 mt-3 md:mt-0">{serviceDetails.name}</h3>
            </div>
            <div className='flex flex-col md:flex-row items-center mt-5'>
            <p className='mx-3'><strong>Price:</strong> {serviceDetails.price_per_sqft 
                                >0.1? `${serviceDetails.price_per_sqft} per sq.ft` 
                              : serviceDetails.price >0.1
                          ? `Rs ${serviceDetails.price}` 
                               : 'Price not available'}</p>
            <p className='mx-0 md:mx-5 mt-3 md:mt-0'><strong>Servicer Name:</strong> {serviceDetails.servicer.name}</p>
            </div>
          </div>
          
        )}
         
        
      <form onSubmit={handleBookingSubmit} className="space-y-4">
        <div className='flex flex-col md:flex-row items-center space-y-4 md:space-y-0'>
        <div className='w-full md:w-1/2' >
          <label htmlFor="service_date" className="mx-3 block text-sm font-medium text-gray-700">Service Date</label>
          <input
            type="date"
            id="service_date"
            value={bookingDetails.service_date}
            onChange={(e) => handleInputChange(e, 'service_date')}
            required
            className="mt-1 mx-3 block w-[200px] border-2 border-gray-400 rounded-md shadow-sm"
          />
        </div>
        <div className='w-full md:w-1/2'>
          <label htmlFor="service_time" className="mx-4 block text-sm font-medium text-gray-700">Service Time</label>
          <input
            type="time"
            id="service_time"
            value={bookingDetails.service_time}
            onChange={(e) => handleInputChange(e, 'service_time')}
            required
            className="mt-1 mx-4 block w-[180px] border-2 border-gray-300 rounded-md shadow-sm"
          />
        </div>
        </div>
        <div>
          <label htmlFor="address" className="mx-3 block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            value={bookingDetails.address}
            onChange={(e) => handleInputChange(e, 'address')}
            required
            className="mt-1 mx-3 block w-[440px] border-2 border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className='flex flex-col md:flex-row items-center'>
        <div className='w-full md:w-1/2'>
          <label htmlFor="city" className="mx-3 block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            id="city"
            value={bookingDetails.city}
            onChange={(e) => handleInputChange(e, 'city')}
            
            className="mt-1 border-2 mx-3 block w-[200px] border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className='w-full md:w-1/2'>
          <label htmlFor="zip_code" className="block text-sm mx-6 font-medium text-gray-700">ZIP Code</label>
          <input
            type="text"
            id="zip_code"
            value={bookingDetails.zip_code}
            onChange={(e) => handleInputChange(e, 'zip_code')}
            className="mx-4 mt-1 block border-2 w-[200px] border-gray-300 rounded-md shadow-sm"
          />
        </div>
       </div>
        
        <div>
          <label htmlFor="instructions" className="block mx-3 text-sm font-medium text-gray-700">Instructions</label>
          <textarea
            id="instructions"
            value={bookingDetails.instructions}
            onChange={(e) => handleInputChange(e, 'instructions')}
            className="mt-1 border-2 mx-3 block w-[440px] border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className='flex flex-col md:flex-row items-center'>
        <div className='w-full md:w-1/2'>
          <label htmlFor="area_sqft" className="block mx-3  text-sm font-medium text-gray-700">Area (sq.ft) Optional</label>
          <input
            type="number"
            id="area_sqft"
            value={bookingDetails.area_sqft}
            onChange={(e) => handleInputChange(e, 'area_sqft')}
            className="mt-1 mx-3 border-2 block w-[200px] border-gray-300 rounded-md shadow-sm"
          />
        </div>
        </div>
        <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
        <button
          type="submit"
          className="bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2 text-white"
        >
          Submit Booking
        </button>
      </form>
    </div>
   
    <div className='w-full lg:w-1/3 p-4 bg-gray-100 border-l border-gray-300 mt-10 mx-5'>
    <h2 className="text-lg font-semibold mb-4 text-center text-blue-700">Service Details</h2>
      <div className="mb-6 ml-6">
        <p className='text-blue-700'><strong>Service:</strong> {serviceDetails.name}</p>
        <p className='text-blue-700'><strong>Description:</strong> {serviceDetails.description}</p>
        <p className='text-blue-700'><strong>Service Type:</strong> {serviceDetails.service_type}</p>
        <p className='text-blue-700'><strong>Servicer Name:</strong> {serviceDetails.servicer.name}</p>
        <p className='text-blue-700'><strong>location:</strong> {serviceDetails.city}</p>
        <p className='text-blue-700'><strong>Duration:</strong> {serviceDetails.period}hrs</p>
        <p className='text-blue-700'><strong>Employees Required:</strong> {serviceDetails.employees_required}</p>
        {serviceDetails.price >0.1? (
    <p className='text-blue-700'><strong>Price:</strong> Rs {serviceDetails.price}</p>
  ) : serviceDetails.price_per_sqft >0.1? (
    <p className='text-blue-700'><strong>Price Per Sqft:</strong> Rs{serviceDetails.price_per_sqft}</p>
  ) : (
    <p className='text-blue-700'><strong>Pricing:</strong> Not Available</p>
  )}
      </div>
      <button 
        
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
      >
        Pay Now
      </button>
    </div>
    
    </div>
    
    </>
  )

}
export default UserReviewBookingComponent