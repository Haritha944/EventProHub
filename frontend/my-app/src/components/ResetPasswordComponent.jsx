// PasswordResetComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation ,useNavigate} from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;
function ResetPasswordComponent() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const uid = queryParams.get('uid');
    const token = queryParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            await axios.post(`${BASE_URL}user/password-reset/`, { uid, token, new_password: newPassword });
            setMessage('Password has been reset.');
            navigate('/login');
            setError('');
        } catch (error) {
            setError('Failed to reset password.');
            setMessage('');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
             <div className="w-full max-w-md bg-blue-100 p-6 rounded-lg shadow-md">
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
                 <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
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
        </div>
    );
}

export default ResetPasswordComponent;
