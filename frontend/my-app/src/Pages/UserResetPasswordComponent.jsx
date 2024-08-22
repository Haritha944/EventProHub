import React from 'react'
import UserFooterComponent from '../components/UserFooterComponent'
import UserNavBarComponent from '../components/UserNavBarComponent'
import ResetPasswordComponent from '../components/ResetPasswordComponent'

const UserResetPasswordComponent = () => {
  return (
    <>
    <UserNavBarComponent/>
    <div className='mt-10'>
    <ResetPasswordComponent/>
    </div>
    <UserFooterComponent/>
    </>
  )
}

export default UserResetPasswordComponent