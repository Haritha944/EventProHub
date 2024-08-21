import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';

function ServicerDashboardComponent  ()  {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = useSelector(state => state.user.token);
    console.log('Auth Token:', token); // For debugging

    useEffect(() => {
        const fetchSubscriptions = async () => {
           
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/provider/servicersubscriptionlist/',{
                headers: {
                    'Authorization': `Bearer ${token.access}`, // Replace `yourToken` with the actual token
                },
            });
                setSubscriptions(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load subscriptions');
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, [token]);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
  return (
    <>
     <div className="p-4 md:p-8 lg:p-12 xl:p-16">
            <h1 className="text-3xl font-bold text-blue-800 text-center mb-5">List of Subscriptions</h1>
            <div className="flex flex-wrap gap-4">
                {subscriptions.map((sub) => (
                    <div key={sub.id} className="bg-teal-300 shadow-md rounded-lg p-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                        <h2 className="text-2xl font-semibold text-blue-700 mb-2 mt-2 text-center">{sub.name}</h2>
                        <p className="text-gray-600 mb-3 mt-3"><strong>Description:</strong> {sub.description}</p>
                        <p className="text-gray-600 mb-2"><strong>Type:</strong> {sub.subscription_type}</p>
                        <p className="text-emerald-600 text-2xl text-center mb-2 mt-3"><strong>Rs {sub.amount}</strong></p>
                        <button
                            className="w-full py-2 px-3 bg-sky-700 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                           >
                            Subscribe
                        </button>
                    </div>
                ))}
            </div>
        </div>
    
    </>
  )
}

export default ServicerDashboardComponent