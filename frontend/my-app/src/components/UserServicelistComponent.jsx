import React,{useState} from 'react'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilteredServices, setService } from '../redux/Slices/userSlice';
import serv from '../Images/last.png'
import { HiExclamation } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const UserServicelistComponent = () => {
   const [services, setServices] = useState([]);
  const filteredServices = useSelector(selectFilteredServices);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
    <div className='relative w-full h-screen mt-12'>
    <img src={serv}  className= "mx-auto w-full h-[500px] justify-center rounded-lg border-2 border-rose-300 " />

      <h2 className="text-dark text-center font-semibold text-3xl mb-2 ">Pick Your Service</h2>
      
        <div className="mb-5 ml-20">
          
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
            
              <HiExclamation className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">No Services Available in selected Location.</div>
           
        </div>
    

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10 ml-20">
      {services.map((service) => (
          <div  className="max-w-sm bg-gray border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mr-2 ml-2">
            <a href="#" >
              <img className="p-8 rounded-t-lg" src={`http://127.0.0.1:8000/${service.images}`} alt="product image" />
            </a>
            <div className="px-5 pb-5">
              <a href="#">
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{service.name} - {service.service_type}</h5>
              </a>
              <h5 className="text-xs mt-2 font-semibold tracking-tight text-gray-900 dark:text-white">{service.location}</h5>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">₹ {service.price}</span>
                <a href="#" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Book Now</a>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  )
}

export default UserServicelistComponent