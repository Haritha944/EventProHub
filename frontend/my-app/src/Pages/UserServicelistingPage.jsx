import React from 'react'
import UserNavBarComponent from '../components/UserNavBarComponent'
import UserFooterComponent from '../components/UserFooterComponent'
import UserServicelistComponent from '../components/UserServicelistComponent'

const UserServicelistingPage = () => {
  return (
    <>
    
   <UserNavBarComponent/>
   <div style={{
      overflowY: 'scroll',
      scrollbarWidth: 'none', /* Firefox */
      msOverflowStyle: 'none', /* IE and Edge */
      /* For WebKit browsers */
      WebkitOverflowScrolling: 'touch',
    }}
    className="scrollbar-hide p-4">
   <UserServicelistComponent/>
   </div>
   <UserFooterComponent/>
  
   
   </>
  )
}

export default UserServicelistingPage