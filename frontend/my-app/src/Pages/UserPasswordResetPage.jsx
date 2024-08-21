import React from 'react'
import UserNavBarComponent from '../components/UserNavBarComponent'

import PasswordResetComponent from '../components/PasswordResetComponent'
import UserFooterComponent from '../components/UserFooterComponent'

const UserPasswordResetPage = () => {
  return (
    <>
    <div className='flex flex-wrap bg-gray-100 w-full h-screen'>
    <UserNavBarComponent/>
    <PasswordResetComponent/>
    <UserFooterComponent/>
    </div>
    </>
  )
}

export default UserPasswordResetPage