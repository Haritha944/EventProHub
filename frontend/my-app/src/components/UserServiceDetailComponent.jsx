import React ,{useState,useEffect}from 'react'
import {useSelector ,useDispatch} from 'react-redux';
import { selectToken,setService,selectSelectedServices } from '../redux/Slices/userSlice';
import { useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';

function UserServiceDetailComponent () {

  const dispatch =useDispatch();
  const { serviceId } = useParams();
  const userToken = useSelector(selectToken);
  const selectedService = useSelector(selectSelectedServices);
  
  const navigate = useNavigate();
  useEffect(() => {
    
    const fetchServiceDetails = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/services/servicedetail/${serviceId}/`);
            console.log('Service details:', response.data);
            dispatch(setService(response.data));
           
        } catch (error) {
            console.error('Error fetching service details:', error);
        }
    };

    fetchServiceDetails();
}, [dispatch,serviceId]);

console.log('Selected Service:', selectedService); 
const handleBookNow = () => {
  if (userToken) {
      navigate('/userreviewbooking');
  } else {
      navigate('/login');
  }
};

  return (
    <>
      {selectedService ? (
                <div className="mt-20 mb-10 mx-10">
                  <div className='flex flex-col md:flex-row'>
                    <div className="md:w-1/2 md:mb-0 mb-10 mt-3">
                        <img 
                            className="max-w-full h-90 rounded-lg shadow-lg" 
                            src={`http://127.0.0.1:8000${selectedService.images}`} 
                            alt={`${selectedService.name} - ${selectedService.city}`} 
                        />
                    </div>
                    <div className="md:w-1/2 md:pl-10 mt-3">
                        <h1 className="text-3xl font-bold text-orange-700 mb-4">{selectedService.name}</h1>
                        <h5 className="font-bold text-orange-500 text-xl">Service Details</h5>
                        <ul className='mt-3'>
                        <li className='font-semibold text-pink-800'>Service Type: <span className='text-black font-normal'>{selectedService.service_type}</span></li>
                        <li className='font-semibold text-pink-800'>Description: <span className='text-black font-normal'>{selectedService.description}</span></li>
                        <li className='font-semibold text-pink-800'>Employees Required: <span className='text-black font-normal'>{selectedService.employees_required}</span></li>
                        <li className='font-semibold text-pink-800'>Duration: <span className='text-black font-normal'>{selectedService.period} hrs</span> </li>
                        <li className='font-semibold text-pink-800'>Additional Notes: <span className='text-black font-normal'>{selectedService.additional_notes}</span></li>
                        </ul>
                        <div className="mt-8">
                            <h6 className="font-bold text-green-700 text-l">Servicer Details</h6>
                            <ul className="mt-2 text-sm">
                          <li>Servicer Name: {selectedService.servicer.name}</li>
                          <li>Servicer Phone: {selectedService.servicer.phone_number}</li>
                          <li>Servicer Experience: {selectedService.servicer.experience}</li>
                          <li>Servicer Address: {selectedService.servicer.address}</li>
                            </ul>
                        </div>
                        <div className="flex items-center mt-4">
                            <button 
                                onClick={handleBookNow} 
                                className="bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2 text-white"
                            >
                                Book Now
                            </button>
                            <div className="flex items-center mt-2">
                              {selectedService.price >0.1 ? (
                         <span className="text-xl font-bold ml-5">Price:₹{selectedService.price}</span>
                        ) : (
                     <span className="text-xl font-bold ml-5">Price: ₹{selectedService.price_per_sqft} per sq.ft</span>
                       )}
                     </div>

                        </div>
                    </div>
                    </div>
                </div>
            ) : (
                <p className="text-center mt-20">Loading service details...</p>
            )}
        


    </>
  )
}

export default UserServiceDetailComponent