import React from 'react'
import UserNavBarComponent from '../components/UserNavBarComponent'
import UserReviewBookingComponent from '../components/UserReviewBookingComponent'
import UserFooterComponent from '../components/UserFooterComponent'

const UserReviewBookingPage = () => {
  return (
    <>
    <div className=''>
    <UserNavBarComponent/>
    <div className='mt-20'>
    <UserReviewBookingComponent/>
    </div>
    <UserFooterComponent/>
    </div>
    </>
  )
}

export default UserReviewBookingPage