
import React from "react";
import { useForm } from "react-hook-form";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { registerServicer } from "../redux/Slices/servicerSlice";
import signup from '../Images/service.png'

const fields = [
  { label: 'Name', name: 'name', type: 'text', required: true, gridCols: 2, placeholder: 'Enter your name' },
  { label: 'Email', name: 'email', type: 'email', required: true, gridCols: 2, placeholder: 'Enter your email' },
  { label: 'Phone Number', name: 'phone_number', type: 'tel', required: true, gridCols: 1, placeholder: 'Enter your phone number' },
  { label: 'Experience', name: 'experience', type: 'text', required: true, gridCols: 1, placeholder: 'Enter your Experience' },
  { label: 'Address', name: 'address', type: 'text', required: true, gridCols: 2, placeholder: 'Enter your address' },
  { label: 'Password', name: 'password', type: 'password', required: true, gridCols: 1, placeholder: 'Enter your password' },
  { label: 'Confirm Password', name: 'password2', type: 'password', required: true, gridCols: 1, placeholder: 'Confirm your password' },
];

export default function ServicerSignupComponent () {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { data, error, loading } = useSelector((state) => state.servicer);
    const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
    } = useForm();

  

    const onSubmit = async (data) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      formData.append("experience", data.experience);
      formData.append("address", data.address);
      formData.append("password", data.password);
      formData.append("password2", data.password2);
     

      dispatch(registerServicer(formData));
    };
    React.useEffect(() => {
        if (data) {
          localStorage.setItem("registeredEmail", data.email);
          navigate("/servicerverifyOTP");
        }
      }, [data, navigate]);
  
       
  return (
    <div>
      <div className="flex container mx-auto mt-48">
      <div className="w-full md:w-1/2 bg-cover bg-center -mt-80" style={{ backgroundImage: `url(${signup})`,width:'500px' }}>
        {/* Optionally add some overlay or content here */}
         </div>
      
         <div className='w-full md:w-1/2 ml-8 flex items-center justify-center bg-gradient-to-tr from-purple-500 to-blue-500 pt-3 md:pl-10'>
        <div className="w-full flex flex-wrap justify-center shadow-2xl rounded-md mx-auto">
          <div className="pb-5">
            <h1 className="text-3xl font-bold">Servicer Registeration</h1>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-start items-center w-full m-auto mx-4"
          >
            <div className="grid grid-cols-1 mb-6 md:grid-cols-2 gap-3 w-full">
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
                    })}
                    className={`border border-gray-300 text-sm font-semibold mb-1 max-w-full w-full outline-none rounded-md m-0 py-3 px-4 md:py-3 md:px-4 md:mb-0 focus:border-red-500 ${
                      field.gridCols === 2 ? "md:w-full" : ""
                    }`}
                    type={field.type}
                    placeholder={field.placeholder}
                  />
                  {errors[field.name] && (
                    <span>This field is required</span>
                  )}
                </div>
              ))}
            </div>

            <div className="w-full text-center">
              <button
                type="submit"
                className="flex justify-center text-bold items-center w-full py-3 px-4 bg-blue-500 text-white text-md font-bold border border-blue-500 rounded-md  hover:bg-white hover:text-blue-500 lg:m-0 md:px-6"
                title="Confirm Order"
              >
                <span>Register</span>
                <HiOutlineArrowCircleRight size={20} />
              </button>
            </div>
            <div className="mt-4 font-semibold text-sm text-indigo-800 text-center md:text-left">
                Already have an account?{" "}
                <a
                    className="text-rose-600 hover:underline hover:underline-offset-4"
                    onClick={() => navigate('/servicerlogin')}

                    href="#"
                >
                    Login
                </a>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}