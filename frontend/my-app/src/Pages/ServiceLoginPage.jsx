import React from 'react'
import UserNavBarComponent from '../components/UserNavBarComponent'
import UserFooterComponent from '../components/UserFooterComponent'
import ServicerLoginComponent from '../components/ServicerLoginComponent'


export const ServiceLoginPage = () => {
  return (
   <>
   <UserNavBarComponent/>
   <ServicerLoginComponent/>
   <UserFooterComponent/>
   </>
  )
}

export default ServiceLoginPage