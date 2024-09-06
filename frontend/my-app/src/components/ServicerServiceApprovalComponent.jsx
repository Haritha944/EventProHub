import React ,{useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchBookedServices, approveService, disapproveService } from '../redux/Slices/adminserviceapprovalSlice'

const ServicerServiceApprovalComponent  = () => {
  const { servicerId } = useParams(); 
  const dispatch = useDispatch();
  const bookedServices = useSelector((state) => state.services.bookedServices);
  const status = useSelector((state) => state.services.status);
  

  useEffect(() => {
    if (servicerId) {
      console.log("Dispatching fetchBookedServices with servicerId:", servicerId);
        dispatch(fetchBookedServices(servicerId));
    }
}, [servicerId, dispatch]);
useEffect(() => {
  console.log("Booked Services State:", bookedServices);
}, [bookedServices]);

if (!servicerId) {
    return <p>Servicer ID is missing or undefined.</p>;
}
   
  const handleApprove = (serviceId) => {
    dispatch(approveService({ serviceId }));
  };

  const handleDisapprove = (serviceId) => {
    dispatch(disapproveService({ serviceId }));
  };
  console.log("servicer",servicerId)
  console.log(bookedServices)
  return (
   <>
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h2 className="text-2xl font-bold mb-4 mt-8 text-center text-sky-600">Booked Services </h2>
      {status === 'loading' && <p>Loading services...</p>}
     
      {bookedServices.length === 0 && status === 'succeeded' && <p>No services found.</p>}
      {bookedServices.length > 0 && (
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
                <td className="px-5 py-4">{service.address}<br/>
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