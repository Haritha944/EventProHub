import React from 'react'
import ServicerSidebarComponent from '../components/ServicerSidebarComponent'
import ServicerDashboardComponent from '../components/ServicerDashboardComponent'


function ServicerDashboardPage  () {
  return (
    <div class="flex flex-wrap bg-gray-100 w-full h-screen">
          <ServicerSidebarComponent/>
          <div className="w-9/12">
              <div className="p-4 text-gray-500">
           <ServicerDashboardComponent/>
            </div>
            </div>
            </div>
  )
}

export default ServicerDashboardPage