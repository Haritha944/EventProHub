import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
function ServicerPasswordResetComponent ()  {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const token = useSelector(state => state.user.token);
    console.log('Auth Token:', token);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            
            await axios.post(`${BASE_URL}provider/servicer-reset-request/`, 
                { email },
                { headers }
            );
            setMessage('Password reset email sent.');
            setError('');
        } catch (error) {
            setError('Failed to send password reset email.');
            setMessage('');
        }
    };
  return (
    <div className="flex items-center justify-center min-h-screen ">
    <div className="w-full max-w-md bg-blue-100 p-6 rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-blue-700 mb-4">Request Password Reset</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full p-2 border border-gray-300 rounded"
        />
        <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
            Send Reset Link
        </button>
    </form>
    {message && <p className="text-green-600 text-center mt-4">{message}</p>}
    {error && <p className="text-red-600 text-center mt-4">{error}</p>}
</div>
</div>
  )
}

export default ServicerPasswordResetComponent