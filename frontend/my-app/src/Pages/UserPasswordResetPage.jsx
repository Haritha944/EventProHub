import React from 'react'
import UserNavBarComponent from '../components/UserNavBarComponent'

import PasswordResetComponent from '../components/PasswordResetComponent'
import UserFooterComponent from '../components/UserFooterComponent'

const UserPasswordResetPage = () => {
  return (
    <>
   
    <UserNavBarComponent/>
    <div className='mt-10'>
    <PasswordResetComponent/>
    </div>
    <UserFooterComponent/>
   
    
    </>
  )
}

export default UserPasswordResetPage