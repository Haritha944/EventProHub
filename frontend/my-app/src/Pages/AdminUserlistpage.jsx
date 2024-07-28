import React from 'react';
import AdminSidebarComponent from '../components/AdminSidebarComponent';
import AdminUserlistComponent from '../components/AdminUserlistComponent';


function AdminUserlistpage ()  {
  return (
    <>
    <div className='flex'>
    <AdminSidebarComponent />
    <div className='p-4 sm:ml-1/3 md:ml-1/4 lg:ml-1/5 w-full'>
        <div className='p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700'>
            <div>
                <h3 className='text-orange-400 font-bold text-2xl mb-5'>Customers</h3>
            </div>
        </div>
    </div>
    </div>
    </>
  )
}

export default AdminUserlistpage