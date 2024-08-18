import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilteredServices, setService } from '../redux/Slices/userSlice';
import new1 from '../Images/front.png'
import new2 from '../Images/NEW2.png'
import { useNavigate } from 'react-router-dom';



const CITY_CHOICES = [
  ['Kasaragod', 'Kasaragod'],
  ['Kannur', 'Kannur'],
  ['Wayanad', 'Wayanad'],
  ['Kozhikode', 'Kozhikode'],
  ['Palakkad', 'Palakkad'],
  ['Thrissur', 'Thrissur'],
  ['Ernakulam', 'Ernakulam'],
  ['Idukki', 'Idukki'],
  ['Malappuram', 'Malappuram'],
  ['Kottayam', 'Kottayam'],
  ['Thiruvananthapuram', 'Thiruvananthapuram'],
  ['Kollam', 'Kollam'],
  ['Alappuzha', 'Alappuzha'],
  ['Pathanamthitta', 'Pathanamthitta'],
];
function UserServicelistComponent  ()  {
  const [services, setServices] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/services/servicelistuser/');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);
  
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleSearch = async () => {
    try {
      if (selectedCity) {
        const response = await axios.get(`http://127.0.0.1:8000/api/services/servicelistuser/${selectedCity}/`);
        setServices(response.data);
        dispatch(selectFilteredServices(response.data));
        navigate('/userservlist');
      } else {
        console.error('Please select a city.');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
  
  const handleServiceClick = (selectedService) => {
    dispatch(setService(selectedService));
    console.log('Selected Service:', selectedService);
    navigate('/userservicedetail');
  };



  return (
    <>
     <div className="bg-blue-100 relative w-full h-screen flex ">
    <div className="w-1/2 h-full flex items-center justify-center bg-gray-100 relative overflow-hidden">
    <div className='text-balance ml-20 mt-5'>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-pink-500 to-blue-400 bg-clip-text text-transparent mb-4">Professional Cleaning Service</h1>
      <p className="text-blue-600 mb-6">We are one of the simple few Consulting firms on the planet to cover Strategic, Tactical parts of Sales and Marketing. We are one of the simple few Consulting firms on the planet</p>
      <button className="bg-gradient-to-t from-sky-400 via-blue-500 to-blue-800 text-black px-6 py-3 rounded-full font-semibold">BOOK NOW</button>
    </div>
    </div>
    <div className="w-1/2 h-full flex items-center justify-center bg-gray-100">
    <div className="absolute w-[540px] h-[540px] border-8 border-sky-200 rounded-full shadow-lg"></div>
    <div className="w-[500px] h-[500px] relative z-10 bg-gradient-to-r from-sky-300 via-fuchsia-200 to-blue-300  rounded-full overflow-hidden shadow-lg">
        <img src={new1} alt="Cleaner" className="object-cover w-[500px] h-[500px] mt-6" />
      </div>
      <div className="absolute ml-2 bottom-0 left-0 right-0 h-24 overflow-hidden">
  <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full mt-10">
    <path fill="#a5d5f6" d="M0,0 C300,90 600,-90 1200,80 L1200,120 L0,120 Z"/>
  </svg>
</div>
    </div>
  </div>
  <div className='relative w-full h-screen flex'>
  <img
        src={new2}
        alt="Descriptive text about the image" className="h-[400px] w-auto object-cover mt-12 ml-20 items-center"
      />
      <div className="absolute inset-0 px-10 py-20 flex items-start justify-center">
        <div>
          <h3 className="text-blue-500 text-center font-bold text-4xl mb-2">FIND A SERVICE</h3>
          <h2 className="text-fuchsia-400 text-center font-semibold mb-10">BOOK YOUR SERVICE TODAY!!</h2>
          <label htmlFor="default-search" className="mb text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
          </label>
          <div className="relative mt-2">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="" disabled defaultValue>
                Choose a City
              </option>
              {CITY_CHOICES.map((city) => (
                <option key={city[0]} value={city[0]}>
                  {city[1]}
                </option>
              ))}
            </select>

            <button
              type="submit"
              onClick={handleSearch}
              className="text-white absolute mr-2 end-2.5 bottom-2.5 bg-blue-700 hover:bg-red-800  font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700">
              Search
            </button>
          </div>
            </div>
          </div>
          </div>
          <div className="relative w-full text-center">
        <div className="flex justify-center items-center mb-2">
          <h1 className="text-3xl font-semibold mb-4">Services</h1>
        </div>
        <div className="flex justify-center">
          {services.length === 0 ? (
            <div className="text-center text-gray-500">No services found.</div>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="max-w-sm rounded overflow-hidden shadow-lg m-4 cursor-pointer"
                onClick={() => handleServiceClick(service)}
              >
                <img className="w-full" src={`http://127.0.0.1:8000${service.images}`} alt="Service" />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{service.name}</div>
                  <p className="text-gray-700 text-base">{service.description}</p>
                  <p className="text-gray-700 text-base">{service.city}</p>
                </div>
                <div className="px-6 pt-4 pb-2">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    ₹{service.price}
                  </span>
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {service.period} hrs
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
         
    </div>
    </>
  )
}

export default UserServicelistComponent