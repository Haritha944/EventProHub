import React from 'react'
import UserNavBarComponent from '../components/UserNavBarComponent'
import UserOTPVerificationComponent from '../components/UserOTPVerificationComponent'


function UserOTPVerificationPage ()  {
  return (
    <>
    <UserNavBarComponent/>
    <div className='mt-50'>
    <UserOTPVerificationComponent/>
    </div>
    </>
  )
}

export default UserOTPVerificationPage;