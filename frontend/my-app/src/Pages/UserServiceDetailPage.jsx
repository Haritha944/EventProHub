import React from 'react'
import { useParams } from 'react-router-dom';
import UserNavBarComponent from '../components/UserNavBarComponent'
import UserFooterComponent from '../components/UserFooterComponent'
import UserServiceDetailComponent from '../components/UserServiceDetailComponent'

function UserServiceDetailPage  () {
  const { serviceId } = useParams(); 
  return (
    <>
    <div className='flex flex-wrap bg-gray-100 w-full h-screen'>
    <UserNavBarComponent/>
    <div className='mt-10'>
    <UserServiceDetailComponent serviceId={serviceId}/>
    </div>
    <UserFooterComponent/>
    </div>
   
    </>
  )
}

export default UserServiceDetailPage