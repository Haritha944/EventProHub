import React ,{useState,useEffect}from 'react'
import {useSelector ,useDispatch} from 'react-redux';
import { FaStar } from 'react-icons/fa'; 
import { selectToken,setService,selectSelectedServices } from '../redux/Slices/userSlice';
import { useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import UserProfileReviewComponent from './UserProfileReviewComponent';
import ServiceDetailFetcherComponent from './ServiceDetailFetcherComponent';
const BASE_URL = process.env.REACT_APP_BASE_URL;
function UserServiceDetailComponent () {

  const dispatch =useDispatch();
  const { serviceId} = useParams();
  const { token } = useSelector((state)=> state.user);
  const selectedService = useSelector(selectSelectedServices);
  const [servicesByLocation, setServicesByLocation] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userReview,setUserReview]=useState(null);
  const [showModal, setShowModal] = useState(false);
  
  
  
  const navigate = useNavigate();
  useEffect(() => {
    // Scroll to the top of the page on component mount
    window.scrollTo(0, 0);
  }, [serviceId]);
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`text-${i <= rating ? 'yellow-400' : 'gray-400'}`}
          size={24}
        />
      );
    }
    return stars;
  };
  useEffect(() => {
    
    const fetchServiceDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}services/servicedetail/${serviceId}/`);
            console.log('Service details:', response.data);
            console.log('token',token.id)
            dispatch(setService(response.data));
           
        } catch (error) {
            console.error('Error fetching service details:', error);
        }
    };
    const fetchReviews = async () => {
      try {
          const response = await axios.get(`${BASE_URL}payments/reviews/${serviceId}/`);
          setReviews(response.data);
          const existingReview=response.data.find(review=> review.user===token.id);
          setUserReview(existingReview || null);
          
      } catch (error) {
          console.error('Error fetching reviews:', error);
      }
  };

    fetchServiceDetails();
    fetchReviews();
}, [dispatch,serviceId,token.id]);

 console.log('Selected Service:', selectedService); 


  const servicerId = selectedService?.servicer;
  console.log('Servicer ID:', servicerId);
  const city = selectedService?.city;

const handleBookNow = () => {
      navigate('/userreviewbooking');
};
const handleServiceClick = (service) => {
  navigate(`/userservicedetail/${service.id}`);
};

const handleNewReview = (newReview) => {
  setReviews((prevReviews) => [...prevReviews, newReview]);
  setUserReview(newReview);
   // Append new review to the state
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
                            <button 
                            onClick= {() => navigate(`/chat?id=${selectedService?.servicer?.id}`)}
                             className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-white ml-4"
                             >
                            Chat
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
            <ServiceDetailFetcherComponent 
                servicerId={servicerId}
                city={city}
            setServicesByLocation={setServicesByLocation}/>
         

            <div className='mt-20 mx-10'>
                <h2 className="text-2xl bg-gradient-to-r from-fuchsia-800 via-blue-500 to-blue-500 bg-clip-text text-transparent font-bold mb-4 text-center">Related Services in the Same Location</h2>
                <div className="overflow-x-auto">
                <div className='flex space-x-6 pb-4 mt-6'>
                {servicesByLocation.length > 0 ? (
                    servicesByLocation.map(service => (
                        <div key={service.id} onClick={() => handleServiceClick(service)} className="flex-none mb-3 w-64 rounded overflow-hidden shadow-lg cursor-pointer ">
                           <img
                               className="w-full h-32 object-cover rounded-t-lg"
                             src={`http://127.0.0.1:8000${service.images}`}
                            alt={service.name}/> 

                            <h3 className="text-lg font-semibold mt-2 p-2">{service.name}</h3>
                            <p className="text-sm text-gray-600 p-2 ">Service Type: {service.service_type}</p>
                            <p className="text-sm text-gray-500 p-2">Duration:{service.period}hrs</p>
                            {service.price > 0.1 && (
                           <p className="text-red-700 text-base font-semibold mb-1 p-2">Price: ₹{service.price}</p>
                                  )}
                           {service.price_per_sqft > 0.1 && (
                              <p className="text-red-600 text-base font-semibold mb-1 p-2">Price: ₹{service.price_per_sqft} per sq.ft</p>
                             )}
                            <div className="px-6 pt-1 pb-1 text-center">
                          <button type="button" className="bg-gradient-to-b from-sky-400 via-blue-500 to-blue-800 text-white font-medium rounded-lg text-sm px-4 py-2 hover:bg-blue-600 ">
                               More Details</button>
                           </div>  
                        </div>
                    ))
                  ) : (
                    <li>No services found for this location.</li>
                  )}
                </div>
                </div>
                <div className="mt-10 mx-5">
                        <h2 className="text-2xl bg-gradient-to-r from-fuchsia-800 via-blue-500 to-blue-500 bg-clip-text text-transparent font-bold mb-4 text-center">
                            Reviews
                        </h2>
                        {reviews.length > 0 ? (
                            <div>
                                {reviews.map((review) => (
                                    <div key={review.id} className="border p-4 mb-2 rounded">
                                       
                                       <div>
                                        <p className="font-semibold"> <PersonIcon className="text-gray-500 mr-3" />User:{review.review_by}</p>
                                        <p>{review.review}</p>
                                        <div className='flex'>Rating: {renderStars(review.stars)}</div>
                                       
                                    </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                         {!userReview && (
                        <button
                         onClick={() => setShowModal(true)} // Open modal on button click
                         className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-white mt-2"
                             >
                         Add Review
                        </button>)}
                        {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded shadow-lg relative w-full max-w-lg">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)} // Close modal on button click
              className="absolute top-2 right-2 text-gray-700"
            >
              &#x2716; {/* X symbol */}
            </button>
            
            <UserProfileReviewComponent serviceId={serviceId} 
            onReviewAdded={handleNewReview}  />
          </div>
        </div>
      )}
      </div>
    </div>
    </>
  )
}

export default UserServiceDetailComponent