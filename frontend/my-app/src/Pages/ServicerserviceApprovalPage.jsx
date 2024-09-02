import React from 'react'
import { useParams } from 'react-router-dom';
import ServicerSidebarComponent from '../components/ServicerSidebarComponent'
import ServicerServiceApprovalComponent from '../components/ServicerServiceApprovalComponent'
function ServicerserviceApprovalPage  () {
    const { servicerId } = useParams(); 
  
    return (
    <>
    <div class="flex flex-wrap bg-gray-100 w-full h-screen">
    <ServicerSidebarComponent/>
    <div className='w-9/12'>
    <ServicerServiceApprovalComponent servicerId={servicerId}/>
    </div>
    </div>
    </>
  )
}

export default ServicerserviceApprovalPage