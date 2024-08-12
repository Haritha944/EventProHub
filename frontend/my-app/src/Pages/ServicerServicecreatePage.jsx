import React from 'react'
import ServicerServicecreateComponent from '../components/ServicerServicecreateComponent'
import ServicerSidebarComponent from '../components/ServicerSidebarComponent'

function ServicerServicecreatePage  ()  {
  return (
    <>  
        <div class="flex flex-wrap bg-gray-100 w-full h-screen">
          <ServicerSidebarComponent/>
          <div className="w-9/12">
              <div className="p-4 text-gray-500">
           <ServicerServicecreateComponent/>
            </div>
            </div>
            </div>
            </>
  )
}

export default ServicerServicecreatePage