import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
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
const SERVICE_TYPES = [
    ['Residential', 'Residential'],
    ['Commercial', 'Commercial'],
    ['Vehicle Washing', 'Vehicle Washing'],
    ['Specific Cleaning', 'Specific Cleaning'],
];


function ServicerServicecreateComponent  () {

    
    const token = useSelector(state => state.user.token);
    
    const [serviceDetails, setServiceDetails] = useState({
        name: '',
        servicer: '', // Assume servicer ID is selected or passed from another component
        city: '',
        service_type: '',
        description: '',
        price: '',
        price_per_sqft: '',
        employees_required: '',
        period: 0,
        additional_notes: '',
        images: null,
    });
    const navigate = useNavigate();
    const handleServiceSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', serviceDetails.name);
            formData.append('servicer', serviceDetails.servicer);
            formData.append('city', serviceDetails.city);
            formData.append('service_type', serviceDetails.service_type);
            formData.append('description', serviceDetails.description);
            formData.append('price', serviceDetails.price);
            formData.append('price_per_sqft', serviceDetails.price_per_sqft);
            formData.append('employees_required', serviceDetails.employees_required);
            formData.append('period', serviceDetails.period);
            formData.append('additional_notes', serviceDetails.additional_notes);
            formData.append('images', serviceDetails.images);

            

            const response = await axios.post('http://127.0.0.1:8000/api/services/servicecreate/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token.access}`,
                },
            });

            console.log(response.data);
            navigate('/servicelist');
        } catch (error) {
            console.error('Error adding service:', error);
            alert('There was an error adding the service. Please try again.');
        }
    };
    const handleInputChange = (e, field) => {
        setServiceDetails({
            ...serviceDetails,
            [field]: e.target.value,
        });
    };
    const handleFileChange = (e) => {
        setServiceDetails({
            ...serviceDetails,
            images: e.target.files[0],
        });
    };  

  return (
    <div>
       <form className="mt-10 mb-10" onSubmit={handleServiceSubmit}>
                <h1 className="text-3xl font-bold text-black text-center mb-5">Add Services</h1>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                         Service Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Service Name"
                            value={serviceDetails.name}
                            onChange={(e) => handleInputChange(e, 'name')}
                        />
                    </div>
                    <div>
                        <label htmlFor="service_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                        Service Type
                        </label>
                        <select
                            id="service_type"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) => handleInputChange(e, 'service_type')}
                            value={serviceDetails.service_type}
                        >
                            <option value="" disabled>
                                Choose a Service Type
                            </option>
                            {SERVICE_TYPES.map((type) => (
                                <option key={type[0]} value={type[0]}>
                                    {type[1]}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">City</label>
                        <select
                            id="city"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={serviceDetails.city}
                            onChange={(e) => handleInputChange(e, 'city')}
                        >
                         <option value="" disabled>
                                Choose a City
                            </option>
                            {CITY_CHOICES.map((city) => (
                                <option key={city[0]} value={city[0]}>
                                    {city[1]}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Description</label>
                        <textarea
                            id="description"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter Service Description"
                            value={serviceDetails.description}
                            onChange={(e) => handleInputChange(e, 'description')}
                        ></textarea>
                    </div>
                   
                    <div>
                        <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                            Price
                        </label>
                        <input
                            type="number"
                            id="price"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter Price"
                            value={serviceDetails.price}
                            onChange={(e) => handleInputChange(e, 'price')}
                        />
                    </div> 
                    <div>
                        <label htmlFor="price_per_sqft" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Price per sqft</label>
                        <input 
                            type="number" 
                            id="price_per_sqft" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Enter Price per Sqft" 
                            value={serviceDetails.price_per_sqft} 
                            onChange={(e) => handleInputChange(e, 'price_per_sqft')} 
                        />
                    </div>
                
                    <div>
                        <label htmlFor="employees_required" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Employees Required</label>
                        <input 
                            type="number" 
                            id="employees_required" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Number of Employees Required"
                            value={serviceDetails.employees_required} 
                            onChange={(e) => handleInputChange(e, 'employees_required')}
                        />
                    </div>
                    <div>
                        <label htmlFor="period" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Duration</label>
                        <input 
                            type="number" 
                            id="period" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Enter Duration"
                            value={serviceDetails.period}
                            onChange={(e) => handleInputChange(e, 'period')} 
                            
                        />
                    </div>
                    <div>
                        <label htmlFor="additional_notes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Additional Notes</label>
                        <textarea
                            id="additional_notes"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter any additional notes"
                            value={serviceDetails.additional_notes}
                            onChange={(e) => handleInputChange(e, 'additional_notes')}
                        ></textarea>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black" htmlFor="file_input">
                            Upload Images
                        </label>
                        <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="file_input"
                            type="file"  onChange={handleFileChange}
                           
                        />
                    </div>
                    
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-10 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Submit
                    </button>
                </div>
            </form>
</div>

  )
}

export default ServicerServicecreateComponent