import React,{useEffect,useState} from 'react';
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;
function ServicerServicelistingComponent  ()  {
    const [services, setServices] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editServiceData, setEditServiceData] = useState({});
    const token = useSelector(state => state.user.token);
    const SERVICE_TYPE_CHOICES = [
        ['Residential', 'Residential'],
        ['Commercial', 'Commercial'],
        ['Vehicle Washing', 'Vehicle Washing'],
        ['Specific Cleaning', 'Specific Cleaning'],
    ];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}services/servicelist/`, {
                    headers: {
                        Authorization: `Bearer ${token.access}`,
                    },
                });
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [token]);
    const handleDeleteService = async () => {
        try {
            await axios.delete(`${BASE_URL}services/delete_service/${selectedServiceId}/`, {
                headers: {
                    Authorization: `Bearer ${token.access}`,
                },
            });
            setServices(services.filter(service => service.id !== selectedServiceId));
            setSelectedServiceId(null);
            setShowModal(false);
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };
    const handleEditService = async () => {
        try {
            const formData = new FormData();
            formData.append('name', editServiceData.name);
            formData.append('service_type', editServiceData.service_type);
            formData.append('description', editServiceData.description);
            formData.append('price', editServiceData.price);
            formData.append('city', editServiceData.city);
            formData.append('additional_notes', editServiceData.additional_notes);
            formData.append('employees_required', editServiceData.employees_required);
            formData.append('price_per_sqft', editServiceData.price_per_sqft);
            formData.append('period', editServiceData.period);
            // Append images if they exist
            const image = editServiceData.images && editServiceData.images[0]; 
            if (image) {
                formData.append('images', image); // Use 'image' as the key for a single image
            }
            const response = await axios.put(`${BASE_URL}services/update_service/${selectedServiceId}/`, editServiceData, {
                headers: {
                    Authorization: `Bearer ${token.access}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Update the services state with the edited service data
            setServices(services.map(service => (service.id === selectedServiceId ? response.data : service)));
            setShowEditModal(false);
            setEditServiceData({});
        } catch (error) {
            console.error('Error updating service:', error);
        }
    };

   
  return (
    <>
    <h2 className='text-2xl sm:text-2xl md:text-3xl font-bold mb-6 text-lime-500 mt-10 text-center'>My Services</h2>
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ml-4">
            {services.map((service) => (
            <div key={service.id} className="flex justify-center mb-4">
                <div className="max-w-sm bg-white border border-teal-400 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mr-2 ml-2">
                    <a href="#">
                        <img className="p-3 rounded-lg shadow w-full h-50 object-cover"  src={`http://127.0.0.1:8000${service.images}`}  alt="product image" />
                    </a>
                    <div className="px-6 pb-6 mb-1">
                        <a>
                            <h5 className="text-xl text-center font-semibold tracking-tight text-blue-700 dark:text-white">{service.name} - {service.service_type}</h5>
                        </a>
                        <h4 className="text-xs mt-2 font-bold tracking-tight text-gray-900 dark:text-white">Description :<span className="text-green-700 dark:text-white"> {service.description}</span></h4>
                       
                        <h3 className="text-xs mt-2 font-bold tracking-tight text-gray-900 dark:text-white">Location: <span className="text-orange-600 dark:text-white"> {service.city} </span></h3>
                        <h3 className="text-xs mt-1 font-bold tracking-tight text-gray-900 dark:text-white">Duration: <span className="text-green-800 dark:text-white"> {service.period}hrs </span></h3>
                        <h3 className="text-xs mt-1 font-bold tracking-tight text-gray-900 dark:text-white">Employees: <span className="text-teal-800 dark:text-white"> {service.employees_required} </span></h3>
                        <h5 className="text-xs mt-1 font-bold tracking-tight text-gray-900 dark:text-white">Added Features:<span className="text-orange-600 dark:text-white"> {service.additional_notes} </span> </h5>
                        <h4 className="text-xs mt-2 font-bold tracking-tight">
                            Status: 
                            {service.is_available ? (
                                <span className="text-green-600 dark:text-green-400"> Admin Approved</span>
                            ) : (
                                <span className="text-red-600 dark:text-red-400" > Pending</span>
                            )}
                        </h4>
                        
                        <div className="flex items-center justify-between mt-4">
                            <span className=" mr-10 text-sm font-semibold text-red-700 dark:text-white">
                            {Number(service.price) > 0.10 ? (
                             <span>{`Price: ₹${service.price}`}</span>
                                 ) : (
                              <span>{`Price per sqft: ₹${service.price_per_sqft}`}</span>
                                         )}
                            </span>
                            <a  onClick={() => {
                                        setShowEditModal(true);
                                        setSelectedServiceId(service.id);
                                        setEditServiceData(service); // Pre-fill the edit form with existing data
                                    }}  className="text-white bg-teal-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-blue-700 ">Edit</a>
                            <a onClick={() => {
                                    setShowModal(true);
                                    setSelectedServiceId(service.id);
                                }} 
                            className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 mx-2">Delete</a>
                        </div>
                       
                    </div>
                </div>
            </div>
            ))}
            </div>
            
            {showModal && (
            <div id="popup-modal" tabindex="-1" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="p-4 md:p-5 text-center">
                            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to Delete?</h3>
                            <button 
                             onClick={handleDeleteService}
                            data-modal-hide="popup-modal" 
                            type="button" 
                            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                Yes, I'm sure
                            </button>
                            <button onClick={() => setShowModal(false)} data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            )}

{showEditModal && (
                <div id="edit-popup-modal" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="p-4 md:p-5">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Edit Service</h3>
                                <form onSubmit={(e) => { 
                                    e.preventDefault(); 
                                    handleEditService(); 
                                }}>
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                            value={editServiceData.name}
                                            onChange={(e) => setEditServiceData({ ...editServiceData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                   <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                  <textarea
                                         id="description"
                                        rows="4"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        value={editServiceData.description}
                                        onChange={(e) => setEditServiceData({ ...editServiceData, description: e.target.value })}
                                         required
                                    />
                                </div>
                                <div className="mb-4">
                            <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                            <textarea
                                id="city"
                                rows="4"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                value={editServiceData.city}
                                onChange={(e) => setEditServiceData({ ...editServiceData, city: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="period" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Period</label>
                            <input
                                type="number"
                                id="period"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                value={editServiceData.period}
                                onChange={(e) => setEditServiceData({ ...editServiceData, period: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="employees_required" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Employees Required</label>
                            <input
                                type="number"
                                id="employees_required"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                value={editServiceData.employees_required}
                                onChange={(e) => setEditServiceData({ ...editServiceData, employees_required: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-4">
                                        <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900">Price</label>
                                        <input 
                                            type="number" 
                                            id="price" 
                                            value={editServiceData.price || ''} 
                                            onChange={e => setEditServiceData({ ...editServiceData, price: e.target.value })} 
                                            className="border border-gray-300 rounded-md p-2 w-full" 
                                            required 
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="price_per_sqft" className="block mb-2 text-sm font-medium text-gray-900">Price per Sqft</label>
                                        <input 
                                            type="number" 
                                            id="price_per_sqft" 
                                            value={editServiceData.price_per_sqft || ''} 
                                            onChange={e => setEditServiceData({ ...editServiceData, price_per_sqft: e.target.value })} 
                                            className="border border-gray-300 rounded-md p-2 w-full" 
                                            required 
                                        />
                                    </div>
                        <div className="mb-4">
                            <label htmlFor="service_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service Type</label>
                            <select
        id="service_type"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        value={editServiceData.service_type}
        onChange={(e) => setEditServiceData({ ...editServiceData, service_type: e.target.value })}
        required
    >
        <option value="">Select a service type</option>
    {SERVICE_TYPE_CHOICES.map(choice => (
        <option key={choice[0]} value={choice[0]}>{choice[1]}</option> 
    ))}
    </select>
    </div>
                        <div className="mb-4">
                            <label htmlFor="images" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Images</label>
                            <input 
                          type="file" 
                           id="images" 
                           name="images"
                           accept="image/*"
                            multiple
                        onChange={(e) => 
                           { const file = e.target.files[0];
                            setEditServiceData({ ...editServiceData, images: file });
                        }}
                          />
                        </div>
                        <div className="mb-4">
                                        <label htmlFor="additional_notes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Additional Notes</label>
                                        <textarea 
                                            id="additional_notes" 
                                            value={editServiceData.additional_notes || ''} 
                                            onChange={e => setEditServiceData({ ...editServiceData, additional_notes: e.target.value })} 
                                            className="border border-gray-300 rounded-md p-2 w-full" 
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button type="submit" className="text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save Changes</button>
                                        <button onClick={() => setShowEditModal(false)} type="button" className="text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-2">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    </>
  )
}

export default ServicerServicelistingComponent