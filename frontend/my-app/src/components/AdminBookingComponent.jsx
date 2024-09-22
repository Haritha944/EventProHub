import React, { useState,useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
function AdminBookingComponent () {
    const [bookings,setBookings]=useState([]);
    const [searchQuery,setSearchQuery]=useState('')
    useEffect(()=>{
        const fetchBookings = async()=>{
            try{
                const response = await axios.get(`${BASE_URL}admin/adminsidebooking/`);
                setBookings(response.data)
            } catch(error){
                console.error('Error fetching Booking:',error);
            }
        };
        fetchBookings();
    },[]);

    const filteredBookings= bookings.filter((booking)=>{
        return(
           booking.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           booking.service?.name.toLowerCase().includes(searchQuery.toLowerCase())||
           booking.service.servicer?.name.toLowerCase().includes(searchQuery.toLowerCase())||
           booking.status.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });
    const downloadPDF = ()=>{
        const input =document.getElementById('booking-table');

        html2canvas(input).then((canvas)=>{
            const imgData= canvas.toDataURL('image/png');
            const pdf=new jsPDF();
            pdf.setFontSize(18); // Set font size for the heading
            pdf.text('Bookings Report', 105, 20, null, null, 'center'); 
            const imgWidth =250;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 30;

            pdf.addImage(imgData,'PNG',10,position,imgHeight,imgHeight);
            heightLeft-=pageHeight;

            while (heightLeft>=0){
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData,'PNG',10,position,imgHeight,imgHeight);
                heightLeft-=pageHeight;

            }
            pdf.save('bookings.pdf');
        });
       
    };
  return (
    <>
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <div className='flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4'>
            <label for ="table-search" className='sr-only'>Search</label>
            <div className='relative'>
                <div className='absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none'>
                  <SearchIcon/>
                </div>
                <input type="text" id="table-search" className='block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg' 
                value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}
                placeholder="Search..."/>
            </div>
            <button onClick={downloadPDF} className='bg-blue-500 text-black p-2 rounded-lg'>Download PDF</button>
        </div>
        <table id="booking-table" className='w-full text-sm text-left rtl:text-right text-gray-500'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-100 '>
                <tr>
                 <th scope="col" className="px-5 py-3">Booking Id</th>
                 <th scope="col" className="px-5 py-3">User</th>
                 <th scope="col" className="px-5 py-3">Servicer</th>
                 <th scope="col" className="px-5 py-3">Service Details</th>
                 <th scope="col" className="px-5 py-3">Amount</th>
                 <th scope="col" className="px-5 py-3">Status</th>
                </tr>
            </thead>
            <tbody>
                {filteredBookings.length>0?(
                    filteredBookings.map((booking) =>(
                     <tr key={booking.id} className="border-t">
                     <td className="py-3 px-6">{booking.id}</td>
                     <td className="py-3 px-6">{booking.user.name}<br/>{booking.address}</td>
                     <td className="py-3 px-6">{booking.service.servicer.name}<br/>{booking.service.servicer.address}</td>
                     <td className="py-3 px-6">{booking.service.name}<br/>{booking.service.service_type}</td>
                     <td className="py-3 px-6">{booking.price_paid}</td>
                     <td className="py-3 px-6">{booking.status}</td>
                 </tr>
                ))
            ):(
                <tr>
                                <td colSpan="6" className="text-center py-3">No bookings found</td>
                            </tr>
            )}
            </tbody>
        </table>
    </div>
    </>
  )
}

export default AdminBookingComponent