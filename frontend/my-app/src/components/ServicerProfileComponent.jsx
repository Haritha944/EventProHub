import React ,{useState,useEffect} from 'react'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';


function ServicerProfileComponent  ()  {
    const [servicerDetails, setServicerDetails] = useState(() => {
        const savedServicerDetails = localStorage.getItem('servicerDetails');
        return savedServicerDetails ? JSON.parse(savedServicerDetails) : null;
    });
    const user = useSelector((state) => state.user); // accessing 'name' from the 'user' slice
    const Token = useSelector(state => state.user.token);
    const accessToken = Token.access
    

    useEffect(() => {
        const fetchServicerDetails = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/provider/servicer_profile/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}` // Include access token in the Authorization header
                    }
                });
                console.log('Servicer Details:', response.data);
                setServicerDetails(response.data);
                localStorage.setItem('servicerDetails', JSON.stringify(response.data));

            } catch (error) {
                console.error('Error fetching servicer details:', error);
            }
        };
        

        
        fetchServicerDetails();
        
    }, [user]);
  return (
    <>
     <h1 className="text-3xl font-bold text-black text-center mb-5">Profile Details</h1>
     <div className="h-full">
        <div className='w-full md:w-3/5 p-8 bg-white lg:ml-56 shadow-md'>
        <div className='flex justify-between '>
        <span className="text-gray-600">Feel Free to Edit Your Details!!</span>
        </div>
        <div className='pb-6 mt-10'>
            <label htmlFor='name'  className="font-semibold text-gray-700 block pb-1">Name</label>
            <div className='flex'>
                <input 
                  id="username"
                  className='border border-gray-200 rounded-r px-4 py-2 w-full'
                  type='text'
                  value={servicerDetails ? servicerDetails.name :''}
                  onChange={(e) => setServicerDetails({ ...servicerDetails, name: e.target.value })}/>
            </div>
        </div>
        <div className='pb-4'>
        <label htmlFor='about'  className="font-semibold text-gray-700 block pb-1">Email</label>
        <input
            id="email"
            className="border border-gray-200  rounded-r px-4 py-2 w-full"
            type="email"
            value={servicerDetails ? servicerDetails.email : ''}
            onChange={(e) => setServicerDetails({ ...servicerDetails, email: e.target.value })}
                    />
        </div>
        <div className="pb-4">
                    <label htmlFor="about" className="font-semibold text-gray-700 block pb-1">Phone Number</label>
                    <input
                        id="number"
                        className="border border-gray-200  rounded-r px-4 py-2 w-full"
                        type="text"
                        value={servicerDetails ? servicerDetails.phone_number : ''}
                        onChange={(e) => setServicerDetails({ ...servicerDetails, phone_number: e.target.value })}
                    />
                </div>
        <div className='pb-4'>
        <label htmlFor="about" className="font-semibold text-gray-700 block pb-1">Address</label>
                    <input
                        id="number"
                        className="border border-gray-200 rounded-r px-4 py-2 w-full"
                        type="text"
                        value={servicerDetails ? servicerDetails.address : ''}
                        onChange={(e) => setServicerDetails({ ...servicerDetails, address: e.target.value })}
                    />
        </div>
        <div className='pb-4'>
        <label htmlFor="about" className="font-semibold text-gray-700 block pb-1">Experience</label>
                    <input
                        id="number"
                        className="border border-gray-200 rounded-r px-4 py-2 w-full"
                        type="text"
                        value={servicerDetails ? servicerDetails.experience : ''}
                        onChange={(e) => setServicerDetails({ ...servicerDetails, experience: e.target.value })}
                    />
        </div>


        </div>
        </div>
    </>
  )
}

export default ServicerProfileComponent