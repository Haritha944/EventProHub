import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';

const BASE_URL = process.env.REACT_APP_BASE_URL;



function UserbookingComponent  ()  {
    const navigate=useNavigate();
    const [bookings, setBookings] = useState([]);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const accessToken = useSelector(state => state.user.token.access);

   

    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                const response = await axios.get(`${BASE_URL}services/bookingslist/`, {
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

    const formatTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert hour to 12-hour format
      const formattedMinutes = minutes.toString().padStart(2, '0'); // Add leading zero if needed
      return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    const handleCancelBooking = async (bookingId) => {
      const bookingToCancel = bookings.find(booking => booking.id === bookingId);
    
    if (!bookingToCancel) {
        alert("Booking not found.");
        return;
    }

    const serviceTime = bookingToCancel.service_time; // Access the service_time from the booking

    // Convert serviceTime to a Date object
    const scheduledServiceTime = new Date(serviceTime);

    // Get the current time
    const currentTime = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = scheduledServiceTime - currentTime;

    // Convert milliseconds to hours
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    // Check if cancellation is allowed (at least 1 hour before the scheduled time)
    if (hoursDifference < 1) {
        alert("You can only cancel your booking at least 1 hour before the scheduled service time.");
        return; // Exit the function if cancellation is not allowed
    }

        try {
            const response = await axios.post(`${BASE_URL}services/cancel-booking/`, { booking_id: bookingId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.status===200){
              const updatedBookings = bookings.map(booking => {
                if (booking.id === bookingId) {
                    return { ...booking, is_canceled: true };
                }
                return booking;
            });
            setBookings(updatedBookings);
            setSuccessModalOpen(true);
            }
            setConfirmModalOpen(false);
            
        } catch (error) {
            console.error('Error cancelling booking:', error);
        }
    };
    
  return (
<div className='flex mt-32 h-full'>
    <div className='sm:w-1/6 md:w-1/6 p-4 bg-gray-100 min-h-screen text-blue-700 shadow-md'>
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

    <div className='w-3/4 md:w-full p-8 bg-gray-100 shadow-md'>
      <div className="mt-1 flex justify-center">
        <h1 className="text-gray-800 font-bold md:text-4xl sm:text-xl">YOUR BOOKINGS</h1>
      </div>
      {bookings.length === 0 ? (
        <div className="flex justify-center items-center flex-col mt-10">
          <p className="text-xl text-gray-600 mb-4">You don't have any bookings yet.</p>
          <button 
            onClick={() => navigate('/userservice')} 
            className="text-white mb-10 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Book Now
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
        <table className="min-w-full bg-white border mt-4 border-gray-200 shadow-md rounded-lg">
        <thead>
                <tr className="w-full bg-gray-100">
                 <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Booking id</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Service Name</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Service Date & Time</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Servicer Details</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Service Details</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Amount Paid</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">User Address</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Booking Status</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Approval Status</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index} className="bg-white shadow-md rounded-lg p-4">
              <td className="text-sm py-3 px-6 font-normal text-blue-700">{booking.id}</td>
              <td className="text-sm py-3 px-6 font-normal text-blue-700">
                {booking.service && `${booking.service.name} - ${booking.service.service_type}`}
              </td>
              <td className="text-gray-600 py-3 px-6 text-sm ">{booking.service_date},<br/>{formatTime(booking.service_time)}</td>
              <td className="text-gray-600 py-3 px-6 text-sm">{booking.service.servicer.name},
                <br/>{booking.service.servicer.address}<br/>Ph: {booking.service.servicer.phone_number}</td>
              <td className="text-gray-600 py-3 px-4 text-sm">Duration:{booking.service.period}hr
                <br/>Employees:{booking.service.employees_required}
              </td>
              <td className="text-gray-600 py-2 px-4 text-sm">{booking.price_paid}</td>
              <td className="text-gray-600 py-2 px-4 text-sm">{booking.user.name}<br/>{booking.address}
                                                                 </td>
              <td className="text-gray-600 py-3 px-4 text-sm">{booking.status}
              </td>
              
              <td className={`text-sm py-3 px-4 font-semibold ${booking.approval_by_servicer ? 'text-green-500' : 'text-red-700'}`}>
              {booking.approval_by_servicer ? 'Approved' : 'Pending'}
              </td >
              <td className='mt-14'>
              {booking.status === 'Completed' ? (
            <span className="text-sm  font-semibold text-green-700 py-3 px-6 mt-5">
                 Completed
              </span>
             ) :
              booking.is_canceled ? (
                <td className=" mt-15 text-sm font-semibold text-red-700 py-3 px-6 ">
                  Cancelled
                </td>
              ) : (
                <button 
                  onClick={() => { setSelectedBookingId(booking.id);setConfirmModalOpen(true); }} 
                  className=" mt-4 text-sm font-bold text-white bg-red-800 rounded-full px-5 py-2 hover:bg-blue-800"
                >
                  Cancel Booking
                </button>
              )}
              </td>
            </tr>
          ))}
        </tbody>
        </table>
        </div>
      )}
    </div>
    
    {isConfirmModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded shadow-lg">
                        <h2 className="text-lg font-semibold">Confirm Cancellation</h2>
                        <p>Are you sure you want to cancel this booking?Only 85% booking amount get refunded</p>
                        <div className="mt-4">
                            <button
                                className="mr-2 bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => handleCancelBooking(selectedBookingId)} // Call onConfirm if confirmed
                            >
                                Yes, Cancel
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setConfirmModalOpen(false)} // Call onClose if canceled
                            >
                                No, Keep Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded shadow-lg">
                        <h2 className="text-lg font-semibold">Success!</h2>
                        <p>Booking cancelled successfully!Within 7 days your amount get refunded in your account</p>
                        <div className="mt-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => setSuccessModalOpen(false)} // Close the modal
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}



  </div>
  )
}

export default UserbookingComponent