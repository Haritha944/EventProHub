import React ,{useEffect,useState} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import { fetchBookedServices, approveService, disapproveService } from '../redux/Slices/adminserviceapprovalSlice'


const BASE_URL = process.env.REACT_APP_BASE_URL;
const ServicerServiceApprovalComponent  = () => {
  const { servicerId } = useParams(); 
  const [bookedServices, setBookedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  

  useEffect(() => {
    const fetchBookedServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BASE_URL}services/approvebooking/${servicerId}/`);
        setBookedServices(response.data);
      } catch (err) {
        setError(err.response?.data?.error|| 'Error fetching services');
      } finally {
        setLoading(false);
      }
    };
    
    
    if (servicerId) {
      fetchBookedServices();
    }
  }, [servicerId]);

useEffect(() => {
  console.log("Booked Services State:", bookedServices);
}, [bookedServices]);

if (!servicerId) {
    return <p>Servicer ID is missing or undefined.</p>;
}
const handleApprove = async (serviceId) => {
  try {
    const response = await axios.put(`${BASE_URL}services/approveservice/${serviceId}/`);
    setBookedServices((prev) =>
      prev.map((service) => (service.id === serviceId ? response.data : service))
    );
  } catch (err) {
    setError(err.response?.data?.error || 'Error approving service');
  }
};

const handleDisapprove = async (serviceId) => {
  try {
    const response = await axios.put(`${BASE_URL}services/disapproveservice/${serviceId}/`);
    setBookedServices((prev) =>
      prev.map((service) => (service.id === serviceId ? response.data : service))
    );
  } catch (err) {
    setError(err.response?.data?.error || 'Error disapproving service');
  }
};

const handleComplete = async (serviceId) => {
  try {
    const response = await axios.put(`${BASE_URL}services/completeservice/${serviceId}/`);
    setBookedServices((prev) =>
      prev.map((service) => (service.id === serviceId ? response.data : service))
    );
    
  } catch (err) {
    setError(err.response?.data?.error || 'Error disapproving service');
  }
}; 
  
if (loading) return <p>Loading services...</p>;
if (error) return <p>{error}</p>;
  console.log("servicer",servicerId)
  console.log(bookedServices)
  return (
   <>
    <div className="relative w-full shadow-md sm:rounded-lg">
      <h2 className="text-2xl font-bold mb-4 mt-8 text-center text-sky-600">Booked Services </h2>
      
      {bookedServices.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-5 mx-5">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-5 py-3">Service ID</th>
              <th scope="col" className="px-5 py-3">Service Date and Time</th>
              <th scope="col" className="px-5 py-3">Service Details</th>
              <th scope="col" className="px-5 py-3">User Details</th>
              <th scope="col" className="px-5 py-3">Price</th>
              <th scope="col" className="px-5 py-3">Payment Status</th>
              <th scope="col" className="px-5 py-3">Booking Status</th>
              <th scope="col" className="px-5 py-3">Approval Status</th>
              <th scope="col" className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookedServices.map((service) => (
              <tr
                key={service.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-5 py-4">{service.id}</td>
                <td className="px-5 py-4">Date:{service.service_date}<br/>
                Time:{service.service_time}<br/></td>
                <td className="px-5 py-4">Name:{service.service.name}<br/>
                Type: {service.service.service_type}<br/>
                Duration: {service.service.period}hrs <br/>
                Employees: {service.service.employees_required}</td>
                <td className="px-5 py-4">{service.user.name}<br/>{service.address}<br/>
                {service.service.city}</td>
               <td className='px-5 py-4'>{service.price_paid}</td>
               <td className='px-5 py-4'>{service.is_paid ? 'Paid' : 'Unpaid'}</td>
               <td className='px-5 py-4'>{service.status}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 rounded-md ${service.approval_by_servicer ? ' text-green-700 font-bold' : ' text-red-700 font-bold'}`}>
                    {service.approval_by_servicer ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {service.approval_by_servicer ? (
                    <button
                      onClick={() => handleDisapprove(service.id)}
                      className="bg-red-700 text-white px-2 py-1 rounded-md"
                    >
                      Disapprove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(service.id)}
                      className="bg-green-700 text-white px-2 py-1 rounded-md"
                    >
                      Approve
                    </button>
                  )}
                  {service.status !== 'Completed' && service.approval_by_servicer &&(
                   <button
                    onClick={() => handleComplete(service.id)}
                    className="bg-blue-800 mt-2 text-white px-2 py-1 rounded-md"
                  >
                    Complete
                  </button>
                )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
   </>
  )
}

export default ServicerServiceApprovalComponent