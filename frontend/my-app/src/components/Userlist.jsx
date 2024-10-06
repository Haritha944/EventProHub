import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { selectSelectedServices } from '../redux/Slices/userSlice';

const Userlist = ({onSelectUser}) => {
    
      const selectedService = useSelector(selectSelectedServices);
      const servicerName = selectedService ? selectedService.servicer.name : ''
  
      useEffect(()=>{
        if (selectedService && selectedService.servicer){
          onSelectUser(selectedService.servicer);
        }
      },[selectedService,onSelectUser])
  
    return (
        <div className="w-1/4 bg-shadow-lg shadow-black h-screen overflow-y-auto pt-20 sticky top-0 mr-2">
      {servicerName ? (
        <div className="m-4 p-2 bg-blue-100 rounded-md">
          Selected Servicer: <span className="font-bold">{servicerName}</span>
        </div>
      ) : (
        <p className="m-4 p-2 bg-red-100 rounded-md">No servicer selected</p> // Optional message when no servicer is selected
      )}
    </div>
  )
}

export default Userlist