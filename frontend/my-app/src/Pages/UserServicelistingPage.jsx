import React from 'react'
import UserNavBarComponent from '../components/UserNavBarComponent'
import UserFooterComponent from '../components/UserFooterComponent'
import UserServicelistComponent from '../components/UserServicelistComponent'

const UserServicelistingPage = () => {
  return (
    <>
    <div className='flex flex-wrap bg-gray-100 w-full h-screen'>
   <UserNavBarComponent/>
   <div className='mt-1'>
   <UserServicelistComponent/>
   </div>
   <UserFooterComponent/>
   </div>
   </>
  )
}

export default UserServicelistingPage