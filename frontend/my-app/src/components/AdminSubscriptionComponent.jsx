import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const SUBSCRIPTION_TYPES = [
    ('Monthly', 'Monthly'),
    ('Quarterly', 'Quarterly'),
    ('Yearly', 'Yearly'),
]
function AdminSubscriptionComponent  ()  {
    
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        amount: '',
        subscription_type: '',
        start_date: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('amount', formData.amount);
        data.append('subscription_type', formData.subscription_type);
        data.append('start_date', formData.start_date);
        console.log([...data.entries()]); 

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/payments/createplan/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    
                }
            });
            alert('Subscription created successfully!');
            console.log(response.data);
            navigate('/adminsubscriplist'); // Redirect to a different page, like subscription list
        } catch (error) {
            console.error('There was an error creating the subscription!', error);
            alert('There was an error creating the subscription. Please try again.');
        }
    };
  return (
    <>
    <div>
            <form className="mt-10 mb-10" onSubmit={handleSubmit}>
                <h1 className="text-3xl font-bold text-black text-center mb-5">Create Subscription Plan</h1>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                            Subscription Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Subscription Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter Description"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Enter Amount"
                            value={formData.amount}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="subscription_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                            Subscription Type
                        </label>
                        <select
                            id="subscription_type"
                            name="subscription_type"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={formData.subscription_type}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Choose a Subscription Type</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Yearly">Yearly</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="start_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={formData.start_date}
                            onChange={handleChange}
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
    </>
  )
}

export default AdminSubscriptionComponent