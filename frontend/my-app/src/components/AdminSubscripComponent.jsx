import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminEditSubscripModalComponent from './AdminEditSubscripModalComponent';

function AdminSubscripComponent  () {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/payments/subscriptionlist/');
                setSubscriptions(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load subscriptions');
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);
    const handleEdit = (subscription) => {
        setSelectedSubscription(subscription);
        setIsModalOpen(true);
        
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/payments/subscriptiondel/${id}/`);
            setSubscriptions(subscriptions.filter(sub => sub.id !== id));
        } catch (error) {
            console.error('Failed to delete subscription', error);
        }
    };
    const handleUpdate = () => {
        // Reload subscriptions after update
        setLoading(true);
        axios.get('http://127.0.0.1:8000/api/payments/subscriptionlist/')
            .then(response => {
                setSubscriptions(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Failed to load subscriptions');
                setLoading(false);
            });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
  return (
    <div className="overflow-x-auto">
    <h1 className="text-3xl font-bold text-blue-800 text-center mb-5">List of Subscriptions</h1>
    <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {subscriptions.map((sub) => (
                <tr key={sub.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.subscription_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sub.start_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Tooltip title="Edit">
                                    <IconButton onClick={() => handleEdit(sub)}>
                                        <EditIcon className='text-blue-600'/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton onClick={() => handleDelete(sub.id)}>
                                        <DeleteIcon className='text-red-600' />
                                    </IconButton>
                                </Tooltip>
                            </td>
                </tr>
            ))}
        </tbody>
    </table>
    {selectedSubscription && (
                <AdminEditSubscripModalComponent
                    open={isModalOpen}
                    handleClose={() => setIsModalOpen(false)}
                    subscription={selectedSubscription}
                    onUpdate={handleUpdate}
                />
            )}
</div>
  )
}

export default AdminSubscripComponent