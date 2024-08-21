// PasswordResetComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function ResetPasswordComponent() {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const uid = queryParams.get('uid');
    const token = queryParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/user/password-reset/', { uid, token, new_password: newPassword });
            setMessage('Password has been reset.');
            setError('');
        } catch (error) {
            setError('Failed to reset password.');
            setMessage('');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                    Reset Password
                </button>
            </form>
            {message && <p className="text-green-600 text-center mt-4">{message}</p>}
            {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        </div>
    );
}

export default ResetPasswordComponent;
