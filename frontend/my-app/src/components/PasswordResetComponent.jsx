// PasswordResetRequestComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';

function PasswordResetComponent() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/user/password-reset-request/', { email });
            setMessage('Password reset email sent.');
            setError('');
        } catch (error) {
            setError('Failed to send password reset email.');
            setMessage('');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4">Request Password Reset</h1>
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
    );
}

export default PasswordResetComponent;
