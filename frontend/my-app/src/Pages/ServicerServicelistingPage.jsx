import React from 'react'
import ServicerSidebarComponent from '../components/ServicerSidebarComponent'
import ServicerServicelistingComponent from '../components/ServicerServicelistingComponent'

function ServicerServicelistingPage ()  {
  return (
    <>
     <div class="flex flex-wrap bg-gray-100 w-full h-screen">
     <ServicerSidebarComponent/>
     <div className='w-9/12'>
     <ServicerServicelistingComponent/>
     </div>
     </div>
    </>
  )
}

export default ServicerServicelistingPage