import React from 'react'
import UserNavBarComponent from '../components/UserNavBarComponent'
import UserFooterComponent from '../components/UserFooterComponent'
import UserProfileComponent from '../components/UserProfileComponent'

function UserProfilePage ()  {
  return (
    <>
    <UserNavBarComponent/>
    <UserProfileComponent/>
    <UserFooterComponent/>
    </>
  )
}

export default UserProfilePage