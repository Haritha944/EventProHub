import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const BASE_URL = process.env.REACT_APP_BASE_URL;
function ServicerDashboardComponent  ()  {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = useSelector(state => state.user.token);
    console.log('Auth Token:', token); // For debugging

    useEffect(() => {
        const fetchSubscriptions = async () => {
           
            try {
                const response = await axios.get(`${BASE_URL}provider/servicersubscriptionlist/`,{
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
    const handleCheckout = async (subscriptionId) => {
        try {
            const response = await axios.post(`${BASE_URL}payments/createcheckout/`, {
                subscription_plan_id: subscriptionId,
            }, {
                headers: {
                    'Authorization': `Bearer ${token.access}`,
                },
            });

            const { session_id } = response.data;

            // Redirect to Stripe Checkout
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId: session_id });

            if (error) {
                console.error('Error redirecting to checkout:', error);
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
  return (
    <>
     <div className="p-4 md:p-8 lg:p-12 xl:p-16">
            <h1 className="text-3xl font-bold text-blue-800 text-center mb-5">List of Subscriptions</h1>
            <div className="flex flex-wrap gap-4">
                {subscriptions.available_plans.length > 0 ? (
                    subscriptions.available_plans.map((sub) => (
                        <div key={sub.id} className="bg-teal-300 shadow-md rounded-lg p-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                            <h2 className="text-2xl font-semibold text-blue-700 mb-2 mt-2 text-center">{sub.name}</h2>
                            <p className="text-gray-600 mb-3 mt-3"><strong>Description:</strong> {sub.description}</p>
                            <p className="text-gray-600 mb-2"><strong>Type:</strong> {sub.subscription_type}</p>
                            <p className="text-emerald-600 text-2xl text-center mb-2 mt-3"><strong>Rs {sub.amount}</strong></p>
                            <button
                                className="w-full py-2 px-3 bg-sky-700 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                onClick={() => handleCheckout(sub.id)}
                            >
                                Subscribe
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No available subscriptions.</p>
                )}
                {subscriptions.paid_plans.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">Paid Subscriptions</h2>
                        {subscriptions.paid_plans.map((sub) => (
                            <div key={sub.id} className="bg-teal-200 shadow-md rounded-lg p-4 mb-4">
                                 <p className="text-blue-700 mb-3 font-bold text-center">Your Subscription Plan is Active </p>
                                 <p className="text-blue-700 mb-3 font-semibold text-center">Ended on {sub.end_date} </p>
                                 <p className='text-emerald-600 text-xl'>Details</p>
                                <h3 className="text-md mt-2 font-semibold text-blue-700 mb-2">{sub.name}</h3>
                                <p className="text-gray-600 mb-3"><strong>Description:</strong> {sub.description}</p>
                                <p className="text-gray-600 mb-2"><strong>Type:</strong> {sub.subscription_type}</p>
                                <p className="text-emerald-600 text-md"><strong>Paid Amount:Rs {sub.amount}</strong></p>
                            </div>
                        ))}
                    </div>
                    
                )}
            </div>
        </div>
     
    </>
  )
}

export default ServicerDashboardComponent