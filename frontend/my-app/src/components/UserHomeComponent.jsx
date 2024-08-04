import React from 'react'
import ThreeDAnimation from '../components/ThreeDAnimation';
import rentals from '../Images/rentals .png'
import cleaning from '../Images/cleaning.png'
import packers from '../Images/packers.png'
import LoginIcon from '@mui/icons-material/Login';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';




const UserHomeComponent = () => {
  return (
    <>
    <div className="relative w-full h-screen flex ">
    <div className="w-1/2 h-full">
      <ThreeDAnimation />
      </div>
      <div className="w-1/2 h-full flex items-center justify-center bg-black">
        <div className="text-left p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-pink-500 to-blue-400 bg-clip-text text-transparent opacity-90">Local Service Providers, Just a Click Away</h1>
          <p className="text-xl text-purple-600 mt-4">Connect with top-rated Rental Servicers, cleaning servicers, and packers & movers right in your area</p>
          <button className="mt-8 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">Get Started</button>
        </div>
      </div>
    </div>
    
<div className='w-full h-full bg-black'>
  <div className='container mx-auto px-4 bg-black '>
  <h2 className="text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-teal-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">Services Offered</h2>
  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 '>
  <div className="relative  mt-10 bg-gradient-to-r from-indigo-300 via-pink-300 to-blue-300 p-4 rounded-lg shadow-md hover:animate-zoom transition-transform">
  <img src={rentals} alt="Rental Services" className="w-full h-48 object-cover rounded-t-lg" />
  <div className="absolute inset-0 bg-gray opacity-0 hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
          <h3 className="text-lg font-bold">Rental Services</h3>
      </div>
        <div className="mt-4">
          <h3 className="text-xl text-blue-800 font-bold">Rental Services</h3>
          <p className="text-gray-700 font-semibold mt-2">Find top-notch rental services for your needs.</p>
        </div>
  </div>
  <div className='relative mt-10 bg-gradient-to-t from-purple-300 via-pink-300 to-red-300 p-4 rounded-lg shadow-md hover:animate-zoom transition-transform'>
  <img src={cleaning} alt="Cleaning Services" className="w-full h-48 object-cover rounded-t-lg" />
        <div className="absolute inset-0 bg-gray opacity-0 hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
          <h3 className="text-lg font-bold">Cleaning Services</h3>
        </div>
        <div className="mt-4">
          <h3 className="text-lg text-blue-800 font-bold">Cleaning Services</h3>
          <p className="text-gray-700 font-semibold  mt-2">Reliable and efficient cleaning services in your area.</p>
        </div>
  </div>
  <div className='relative mt-10 bg-gradient-to-t from-purple-300 via-pink-300 to-red-300 p-4 rounded-lg shadow-md hover:animate-zoom transition-transform '>
    <img src={packers} alt="Packers & Movers" className="w-full h-48 object-cover rounded-t-lg" />
  <div className="absolute inset-0 bg-gray opacity-0 hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
          <h3 className="text-lg font-bold">Packing Services</h3>
        </div>
        <div className="mt-4">
          <h3 className="text-lg text-blue-800 font-bold">Packers & Movers</h3>
          <p className="text-gray-700 font-semibold mt-2">Professional packers and movers for hassle-free relocation.</p>
        </div>
  </div>
    </div>
  </div>
  </div>
  <div className='w-full h-full bg-black p-4'>
  <h2 className="mt-36 bg-gradient-to-t from-pink-600 to-blue-500 bg-clip-text text-transparent mb-4 text-center font-semibold text-3xl">How to Get in Touch with Service Providers?</h2>

<div className="flex ml-20">

  <div className="max-w-xs hover:animate-wiggle transition-transform bg-gradient-to-r from-rose-400 to-blue-400 border border-blue-500 rounded-lg ml-10 mb-5 mt-5">
      <div className="flex justify-center items-center rounded-t-lg h-40">
          <LoginIcon className='text-blue-800' style={{ fontSize: 90 }}  />
      </div> 
      <div className="p-3">
      <p className="mb-1 font-semibold text-center text-gray-800">Select Location and Date</p>
      </div>
  </div>
  <div className="max-w-xs hover:animate-wiggle bg-gradient-to-r from-rose-400 to-blue-400 border border-blue-500 rounded-lg ml-10 mb-5 mt-5">
      <div className='flex justify-center items-center rounded-t-lg h-40 '>
      <EditCalendarIcon className='text-blue-800' style={{ fontSize: 90 }}  />
      </div> 
      <div className="p-3">
      <p className="mb-1 font-semibold text-center text-gray-800">Customize your booking </p>
      </div>
  </div>
  <div className="max-w-xs hover:animate-wiggle bg-gradient-to-r from-rose-400 to-blue-400 border border-blue-500 rounded-lg ml-10 mb-5 mt-5">
      <div className='flex justify-center items-center rounded-t-lg h-40'>
      <AttachMoneyIcon className='text-blue-800' style={{ fontSize: 90 }}  />
      </div> 
      <div className="p-3">
      <p className="mb-1 font-semibold text-center text-gray-800">Confirm and Make a payment</p>
      </div>
  </div>

  <div className="max-w-xs hover:animate-wiggle bg-gradient-to-r from-rose-400 to-blue-400 border border-blue-500 rounded-lg ml-10 mb-5 mt-5">
      <div className='flex justify-center items-center rounded-t-lg h-40'>
      <SentimentSatisfiedAltIcon className='text-blue-800' style={{ fontSize: 90 }}  />
      </div> 
      <div className="p-3">
      <p className="mb-2 font-semibold text-center text-gray-800">Enjoy our Service </p>
      </div>
  </div>
  </div>
  </div>
  <div className='flex flex-col items-center justify-center pt-10 bg-black space-y-8'>
  <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent'>
        Join Our Platform and Enhance Your Experience!
      </h1>
      <div className='flex'>
      <p className="text-xl bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent mb-10 px-4 mt-2">
        We are committed to providing expert services.Connect with our service providers and enjoy exceptional service.
      </p>
  <button className="bg-blue-500 mx-1 hover:bg-white hover:text-blue-600 text-white font-bold py-1 px-4 rounded-lg transition duration-300 ease-in-out">
  Book a Service
      </button>
      </div>
  </div>

   
</>
    
  
  )
}

export default UserHomeComponent