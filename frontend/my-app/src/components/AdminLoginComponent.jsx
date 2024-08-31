import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const BASE_URL = process.env.REACT_APP_BASE_URL;
export const AdminLoginComponent = () => {
    const navigate = useNavigate()
    const [formData,setFormData] = useState({
        email:'',
        password:'',
    })
    const [error, setError] = useState('');
    const handleChange = (e)=>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value});
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
    try{
        console.log('entered')
        const response = await axios.post(`${BASE_URL}admin/admin-login/`,formData);
        localStorage.setItem('adminToken',response.data.token);
        navigate('/adminuserlist');
    } catch(error){
        setError('Login failed. Please check your credentials and try again.');
    }
    };
  return (
    <div className='flex justify-center items-center h-screen'>
        <div className='w-full max-w-md p-8 bg-gray-100 shadow-lg rounded-lg'>
        <div className="flex justify-center items-center mb-6">
            <h2 className='text-2xl text-blue-600 font-bold mb-6 flex items-center'>
            <AccountCircleIcon className='mr-3 mt-2' />Admin Login</h2>
            </div>
            {error && <div className='text-red-600 mb-4'>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="email">Email</label>
                    <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-bold mb-2 text-gray-700' htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div className='flex justify-center'>
                <button type="submit" className=' text-white text-bold rounded-md bg-green-800  px-5 py-1'>Login</button>
                 </div>
            </form>
        </div>
    </div>
  )
}

export default AdminLoginComponent;