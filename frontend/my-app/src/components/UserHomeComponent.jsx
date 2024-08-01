import React from 'react'
import ThreeDAnimation from '../components/ThreeDAnimation';

const UserHomeComponent = () => {
  return (
    
    <div className="relative w-full h-screen flex">
    <div className="w-1/2 h-full">
      <ThreeDAnimation />
      </div>
      <div className="w-1/2 h-full flex items-center justify-center bg-gray-100">
        <div className="text-left p-8">
          <h1 className="text-3xl font-bold text-blue-700 opacity-90">Local Service Providers, Just a Click Away</h1>
          <p className="text-xl text-purple-600 mt-4">Connect with top-rated Rental Services, cleaning services, and packers & movers right in your area</p>
          <button className="mt-8 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">Get Started</button>
        </div>
      </div>
    </div>
    
  
  )
}

export default UserHomeComponent