import React, {useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import man from '../Images/prof.png';
import { selectSelectedServices } from '../redux/Slices/userSlice';

const Userlist = ({receivers=[],onSelectUser}) => {
      
      
      const selectedService = useSelector(selectSelectedServices);
      const servicerName = selectedService ? selectedService.servicer.name : ''
      const selectedServicerId = selectedService ? selectedService.servicer.id : null;
      
      const filteredReceivers = selectedServicerId
      ? receivers.filter(receiver => receiver.id !== selectedServicerId)
      : receivers;
  
      useEffect(()=>{
        if (selectedService && selectedService.servicer){
          onSelectUser(selectedService.servicer);
        }
      },[selectedService,onSelectUser])
  
    return (
        <div className="w-1/4 bg-shadow-lg shadow-black h-screen overflow-y-auto pt-20 sticky top-0 mr-2">
      {servicerName ? (
        <div className="m-4 p-2 bg-blue-100 rounded-md flex items-center">
        {/* Avatar Section */}
        <img
          src={man} // Replace with actual URL or a default avatar
          alt="Servicer Avatar"
          className="w-16 h-16 rounded-full mr-4" // Adjust size and shape of the avatar
        />
        <div>
        <div className="m-2 p-2 bg-blue-100 rounded-md">
          Selected Servicer: <span className="font-bold">{servicerName}</span>
        </div>
        </div>
    </div>
      ) : (
        <p className="m-4 p-2 bg-red-100 rounded-md">No servicer selected</p> // Optional message when no servicer is selected
      )}
       <div className="mt-4 m-4 p-2">
        <h2 className="text-lg font-bold">Available Receivers</h2>
        {filteredReceivers.length > 0 ? (
          <ul>
            {filteredReceivers.map((receiver) => (
              <li
                key={receiver.id}
                
                onClick={() => {
                  console.log("Selected Receiver:", receiver); // Log receiver info
                  onSelectUser(receiver); // Call onSelectUser when clicked
                }} // Call onSelectUser when clicked
                className="cursor-pointer hover:bg-blue-100 p-2 rounded-md"
              >
                 {receiver.name} - {receiver.phone_number} 
              </li>
            ))}
          </ul>
        ) : (
          <p>No receivers available.</p>
        )}
      </div>
    </div>

   

    
  )
}

export default Userlist