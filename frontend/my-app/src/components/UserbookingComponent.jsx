import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
const BASE_URL = process.env.REACT_APP_BASE_URL;



function UserbookingComponent  ()  {
    const navigate=useNavigate();
    const [bookings, setBookings] = useState([]);
    const accessToken = useSelector(state => state.user.token.access);
    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                const response = await axios.get(`${BASE_URL}user/bookings/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching user bookings:', error);
            }
        };

        fetchUserBookings();
    }, [accessToken]);

    const handleCancelBooking = async (bookingId) => {
        try {
            await axios.post(`${BASE_URL}user/cancel-booking/`, { booking_id: bookingId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const updatedBookings = bookings.map(booking => {
                if (booking.id === bookingId) {
                    return { ...booking, is_canceled: true };
                }
                return booking;
            });
            setBookings(updatedBookings);
        } catch (error) {
            console.error('Error cancelling booking:', error);
        }
    };
  return (
<div className='flex mt-32 h-full'>
    <div className='sm:w-1/4 md:w-1/4 p-4 bg-gray-100 min-h-screen text-blue-700 shadow-md'>
      <div className='items-center space-x-4 p-2 mb-5'>
        <h2 className="text-xl font-bold mb-4">Sidebar</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a 
              onClick={() => navigate('/userprofile')} 
              className="flex items-center space-x-1 text-emerald-700 p-2 rounded-md font-medium hover:bg-sky-200 focus:bg-sky-200 focus:shadow-outline"
            >
              <span className="text-teal-600">
                <PersonIcon />
              </span>
              <span>My Profile</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div className='w-3/4 md:w-3/5 p-8 bg-gray-100 shadow-md'>
      <div className="mt-1 flex justify-center">
        <h1 className="text-gray-800 font-bold md:text-4xl sm:text-xl">YOUR BOOKINGS</h1>
      </div>
      {bookings.length === 0 ? (
        <div className="flex justify-center items-center flex-col mt-10">
          <p className="text-xl text-gray-600 mb-4">You don't have any bookings yet.</p>
          <button 
            onClick={() => navigate('/userbikelist')} 
            className="text-white mb-10 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Book Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {bookings.map((booking, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-bold text-blue-700">
                {booking.bike_details && `${booking.bike_details.brand.name} - ${booking.bike_details.model.name}`}
              </h2>
              <p className="text-gray-600">Pickup Date: {booking.pickup_date}</p>
              <p className="text-gray-600">Drop Date: {booking.drop_date}</p>
              <p className="text-gray-600">City: {booking.city}</p>
              <p className="text-gray-600">Amount Paid: {booking.amount_paid}</p>
              <p className="text-gray-600">Owner: {booking.owner}</p>
              <p className="text-gray-600">
                {booking.first_name} {booking.last_name}, {booking.phone_number}
              </p>
              {booking.is_canceled ? (
                <p className="mt-4 text-md font-bold text-white bg-red-700 rounded-full px-5 py-2">
                  Cancelled
                </p>
              ) : (
                <button 
                  onClick={() => handleCancelBooking(booking.id)} 
                  className="mt-4 text-md font-bold text-white bg-blue-700 rounded-full px-5 py-2 hover:bg-blue-800"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  )
}

export default UserbookingComponent