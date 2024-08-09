import React from 'react';
import UserHomeComponent from '../components/UserHomeComponent';
import UserNavBarComponent from '../components/UserNavBarComponent';
import UserFooterComponent from '../components/UserFooterComponent';



function Homepage () {
  return (
    <>
      <div className="flex flex-col min-h-screen overflow-x-hidden">
    <UserNavBarComponent/>
    <div className='flex-grow'>
    <UserHomeComponent/>
    </div>
    <UserFooterComponent/>
    </div>
    </>
  )
}

export default Homepage;