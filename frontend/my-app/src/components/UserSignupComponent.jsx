import React from 'react'
import {useForm} from "react-hook-form";
import { useNavigate ,Link} from 'react-router-dom';
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import axios from 'axios';
import {useState} from "react";
import {jwtDecode} from "jwt-decode";
import { setUserEmail,setUserName } from '../redux/Slices/userSlice';
import { useDispatch } from 'react-redux';
import signup from '../Images/lady.png'
const fields = [
    {label:'Name',name:'name',type:'text',required : true,gridCols:2, placeholder:'Enter your Name'},
    {label:'Email',name:'email',type:'text',required:true,gridCols:2,placeholder:'Enter your Email'},
    {label:'Phone Number',name:'phone_number',type:'tel',required:true,gridCols:2,placeholder:'Enter your Phone Number'},
    {label:'Password',name:'password',type:'password',required:true,gridCols:2,placeholder:'Enter your Password'},
    {label:'Confirm Password',name:'password2',type:'password',required:true,gridCols:2,placeholder:'Confirm your password'},
];

export default function UserSignupComponent () {
    const dispatch=useDispatch()
    const navigate= useNavigate()
    const {
        register,
        handleSubmit,formState:{errors},watch,getValues
    } = useForm();
    const [formData,setFormData] = useState(new FormData());
    const onSubmit = async (data)=>{
        try{
            const formData = new FormData();
            console.log(data);
            formData.append("name",data.name);
            formData.append("email", data.email);
            formData.append("phone_number", data.phone_number);
            formData.append("password", data.password);
            formData.append("password2", data.password2);
            console.log(formData,"formData");
            const response = await axios.post(
                "http://localhost:8000/api/user/register/",
                formData,
            );
            console.log(response.data);
            localStorage.setItem("registered Email",data.email);
            navigate("/verifyOTP");
        }catch (error) {
            console.error(
              "Registration failed:",
              error.response?.data || error.message
            );
          }
    }
  return (
    <div>
        <div className='flex h-screen mx-auto mt-40 mr-3 md:pl-10'>
        <div className="w-full md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${signup})`,width:'500px' }}>
        {/* Optionally add some overlay or content here */}
         </div>
        <div className='w-full md:w-1/2 flex items-center justify-center pt-4 md:pl-10'>
            <div className='w-full flex flex-wrap justify-center shadow-2xl my-20 rounded-md mx-auto'>
            <div className='pb-5 '>
                <h1 className='text-2xl font-bold mt-2 '>USER REGISTRATION</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-start items-center w-full m-auto'>
            <div className="grid grid-cols-1 mb-6 md:grid-cols-2 gap-3 w-7/12">
              {fields.map((field, index) => (
                <div
                  key={index}
                  className={`text-left flex flex-col gap-2 w-full ${
                    field.gridCols === 2 ? "md:col-span-2" : ""
                  }`}
                >
                  <label className="font-semibold">{field.label}</label>
                  <input
                    {...register(field.name, {
                      required: field.required,
                      ...(field.name === 'name' && {
                        minLength:{
                            value:5,
                            message:'Name must be at least 5 characters long'
                        },
                        pattern:{
                            value: /^[A-Za-z0-9]+$/,
                            message: 'Name must not contain spaces or special characters'
                        }
                      }), ...(field.name ==='email' &&{
                        pattern:{
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email address'
                        }
                    }),
                    ...(field.name === 'password' && {
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters long'
                        }
                    }),
                    ...(field.name === 'password2' && {
                        validate: value =>
                            value === getValues('password') || 'Passwords do not match'
                    })
                })}

                    className={`border border-gray-300 text-sm font-semibold mb-1 max-w-full w-full outline-none rounded-md m-0 py-2 px-4 md:py-3 md:px-4 md:mb-0 focus:border-red-500 ${
                      field.gridCols === 2 ? "md:w-full" : ""
                    }`}
                    type={field.type}
                    placeholder={field.placeholder}
                  />
                  {errors[field.name] && (
                    <span className='text-red-600'>{errors[field.name].message}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="w-full flex justify-center mb-2">
              <Link to="/login" className="text-blue-700 ">Already registered? Login</Link>
            </div>
            
            <div className="w-7/12 text-left">
              <button
                type="submit"
                className="flex justify-center text-bold items-center gap-2 w-full py-2 px-4 bg-green-800 text-white text-md font-bold border border-green-500 rounded-md ease-in-out duration-150 shadow-slate-600 hover:bg-white hover:text-green-500 lg:m-0 md:px-6"
                title="Confirm Order"
              >
                <span>Register</span>
                <HiOutlineArrowCircleRight size={20} />
              </button>
            </div>

            </form>
            </div>
            </div>
        </div>
    </div>
  )
}

