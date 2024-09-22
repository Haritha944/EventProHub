import React ,{useState,useEffect}from 'react'
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
function AdminServicelistComponent  () {
    const [services,setServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("");
    const [error,setError]=useState(null);
  

    useEffect (()=>{
        const fetchServices = async ()=>{
            try {
                
                const response = await axios.get(`${BASE_URL}admin/service-list/`);
                setServices(response.data);
                
                
            } catch (error){
                console.error('Error fetching services:', error);
                setError('Error fetching services'); 
            }
        };
        fetchServices();
    },[]);
    
        
    
    const handleApproveService = (serviceId, isAvailable) => {
        const action = isAvailable ? "disapprove" : "approve";
        const path = `${BASE_URL}admin/service/${serviceId}/${action}/`;

        axios.put(path, {})
            .then((response) => {
                setServices((prevServices) =>
                    prevServices.map((service) =>
                        service.id === serviceId ? { ...service, is_available: !isAvailable } : service
                    )
                );
                setError(null);
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || `Error ${action}ing service`;
                setError(errorMessage);
                console.log(error, `Error ${action}ing service:`);
            });
    };
    useEffect(() => {
        console.log("Available service types:", [...new Set(services.map(service => service.service_type))]);
    }, [services]);

    const filteredServices = services.filter(service =>
        
        (service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.service_type.toLowerCase().includes(searchQuery.toLowerCase())||
        service.servicer_name.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterType === "" || service.service_type.toLowerCase() === filterType.toLowerCase())
    );
    const closeModal = () => setError(null);
  return (
    <>
      {error && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-5 rounded shadow-md">
                        <h2 className="text-lg font-semibold">Error</h2>
                        <p className="mt-2 text-red-500">{error}</p>
                        <button onClick={closeModal} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <input type="text" id="table-search" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..."
                        value = {searchQuery}  onChange={(e) => setSearchQuery(e.target.value)}/>
                    </div>
                    <div className="relative">
                        <label htmlFor="serviceTypeFilter" className="sr-only">Filter by Service Type</label>
                        <select
                            id="serviceTypeFilter"
                            className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-48 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="vehicle washing">Vehicle Washing</option>
                            <option value="specific cleaning">Specific Cleaning</option>
                        </select>
                    </div>
                    
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-5 py-3">ID</th>
                            <th scope="col" className="px-5 py-3">Name of Service</th>
                            <th scope="col" className="px-5 py-3">Servicer Details</th>
                            <th scope="col" className="px-5 py-3">Price</th>
                            <th scope="col" className="px-5 py-3">Employees Required and Time</th>
                            <th scope="col" className="px-5 py-3">Additional Notes</th>
                            <th scope="col" className="px-5 py-3">Created At</th>
                            <th scope="col" className="px-5 py-3">Images</th>
                            <th scope="col" className="px-5 py-3">Status</th>
                            <th scope="col" className="px-5 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredServices.map((service) => (
                            <tr key={service.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{service.id}</th>
                                <td className="px-5 py-4">{service.name}<br/> Service Type:{service.service_type}</td>
                                
                                <td className="px-5 py-4">{service.servicer_name} <br/> {service.servicer_phone_number}</td>
                                <td className="px-5 py-4">
                                {Number(service.price) > 0.10 ? (
                             <span>{`Price: ₹${service.price}`}</span>
                                 ) : (
                              <span>{`Price per sqft: ₹${service.price_per_sqft}`}</span>
                                         )}
                                    </td>
                                <td className="px-5 py-4">{service.employees_required}<br/>{service.period}hrs</td>
                                <td className="px-5 py-4">{service.additional_notes}</td>
                                <td className="px-5 py-4">{service.created_at}</td>
                                <td>
                               {service.images ? (
                              <img
                               src={service.images}
                               alt={service.name} style={{ width: '100px', height: 'auto' }}
                                  />
                              ) : (
                            'No image available'
                                   )}
                                </td>
                                <td className="px-5 py-4">
                                <span className={`px-2 py-1 rounded-md ${service.is_available ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}>
                                 {service.is_available ? 'True' : 'False'}
                </span>
                                </td>
                                <td className="px-5 py-4">
                                    <button onClick={() => handleApproveService(service.id, service.is_available)}
                                        className={`${
                                            service.is_available ? "bg-red-500" : "bg-green-500"
                                        } text-white  px-2 py-1 rounded-md`}
                                    >
                                        {service.is_available ? "Disapprove" : "Approve"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                      
                    </tbody>
                </table>
            </div>
            </>
  )
}

export default AdminServicelistComponent