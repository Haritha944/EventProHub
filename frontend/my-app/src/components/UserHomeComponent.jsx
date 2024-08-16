import React from 'react'
import {motion} from 'framer-motion'
import rentals from '../Images/rentals.png'
import cleaning from '../Images/cleaning.png'
import packers from '../Images/carwash.jpg'
import LoginIcon from '@mui/icons-material/Login';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import septic from '../Images/septic.jpg'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import home3 from '../Images/home33.png'
import Bubbles from './Bubble'
import about from '../Images/about.jpg'
import about2 from '../Images/about2.jpg'
import HomeIcon from '@mui/icons-material/Home';
import FactoryIcon from '@mui/icons-material/Factory';
import Clean from '../Images/last2.png'
import man from '../Images/man.png'
import AddIcon from '@mui/icons-material/Add';
import prof1 from '../Images/prof1.png'
import prof from '../Images/home2.png'



const SlideUp = (delay)=>{
  return {
    initial:{
      y:'100%',
      opacity:0
    },
    animate:{
      y:0,
      opacity:1,
      transition:{
        duration:0.6,
        delay:delay,
      }
    }
  }
}



const UserHomeComponent = () => {
  return (
    <>
    <div className="relative w-full h-screen flex ">
    <div className="w-1/2 h-full flex items-center justify-center bg-gray-100 relative overflow-hidden">
    <div className="text-balance ml-20 mt-5">
          <motion.h2 variants={SlideUp(1.5)} initial="initial" whileInView="animate" className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-pink-500 to-blue-400 bg-clip-text text-transparent opacity-90">Find Your Perfect Cleaner – Multiple Servicers, One Platform</motion.h2>
          <motion.p variants={SlideUp(1.5)} initial="initial" whileInView="animate" className="text-xl text-purple-600 mt-4">Seamlessly connect with expert cleaners for every need, from home to office.</motion.p>
          <motion.button variants={SlideUp(1.5)} initial="initial" whileInView="animate" className="mt-8 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">Get Started </motion.button>
        </div>
      </div>
      <div className="w-1/2 h-full flex items-center justify-center bg-gray-100">
       <div className=''><Bubbles/></div>
        <motion.img initial={{opacity:0,rotate:120,x:200, y:100}} whileInView={{opacity:1,rotate:0,x:0,y:0}}
         transition={{duration:2.5}} src={home3} alt="image" className='w-[200px] h-150px] absolute bottom-[0px] right-2 z-10'/>
       
      </div>
    </div>
    
<div className='w-full h-full container mx-auto px-4 py-8 bg-gray-100'>
<div className='container mx-auto px-4 bg-gray-100 '>
  <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-teal-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">Services Offered</h2>
  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
    <div className='flex flex-col items-center'>
  <div className=" relative mt-10 bg-gradient-to-r from-indigo-300 via-pink-300 to-blue-300 rounded-lg p-4 shadow-md hover:animate-zoom transition-transform">
  <img src={rentals} alt="Rental Services" className="w-full h-48 object-cover rounded-t-lg border-2 border-rose-300 " />
  <div className="absolute inset-0 bg-gray opacity-0 hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
          <h3 className="text-xl font-bold mb-2">Residential Cleaning</h3>
          <p className='text-center text-gray-600 mb-4'></p>
      </div>
        <div className="mt-4">
        <h3 className="text-xl text-blue-800 font-bold text-center">Residential cleaning</h3>
          <p className="text-gray-700 text-center font-semibold mb-2">Find top-notch home cleaning services for your needs.</p>
          <div className="flex justify-center"><ExpandCircleDownIcon className=' text-blue-700'/></div>
        
        </div>
  </div>
  </div>
  <div className='relative mt-10 bg-gradient-to-t from-purple-300 via-pink-300 to-red-300 p-4 rounded-lg shadow-md hover:animate-zoom transition-transform'>
  <img src={cleaning} alt="Cleaning Services" className="w-full h-48 object-cover rounded-t-lg border-2 border-blue-300" />
        <div className="absolute inset-0 bg-gray opacity-0 hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
          <h3 className="text-lg font-bold">Commercial Cleaning</h3>
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg text-blue-800 font-bold">Commercial Cleaning Services</h3>
          <p className="text-gray-700 font-semibold  mt-2">Reliable and efficient cleaning services in your area.</p>
          <div className="flex justify-center"><ExpandCircleDownIcon className=' text-blue-700'/></div>
        </div>
  </div>
  <div className='relative mt-10 bg-gradient-to-t from-purple-300 via-pink-300 to-red-300 p-4 rounded-lg shadow-md hover:animate-zoom transition-transform '>
    <img src={packers} alt="Vehicle washing" className="w-full h-48 object-cover rounded-t-lg border-2 border-rose-400" />
  <div className="absolute inset-0 bg-gray opacity-0 hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
          <h3 className="text-lg font-bold">Vehicle Washing</h3>
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg text-blue-800 font-bold">Vehicle Cleaning</h3>
          <p className="text-gray-700 font-semibold mt-2">Expert vehicle cleaning services for a spotless ride</p>
          <div className="flex justify-center"><ExpandCircleDownIcon className=' text-blue-700'/></div>
        </div>
  </div>

  <div className='relative mt-10 bg-gradient-to-t from-purple-300 via-pink-300 to-red-300 p-4 rounded-lg shadow-md hover:animate-zoom transition-transform '>
    <img src={septic} alt="Septic Tank Cleaning" className="w-full h-48 object-cover rounded-t-lg border-2 border-rose-400" />
  <div className="absolute inset-0 bg-gray opacity-0 hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
          <h3 className="text-lg font-bold">Water Tank Cleaning</h3>
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg text-blue-800 font-bold">Water Tank Cleaning</h3>
          <p className="text-gray-700 font-semibold mt-2">Expert vehicle cleaning services for a spotless ride</p>
          <div className="flex justify-center"><ExpandCircleDownIcon className=' text-blue-700'/></div>
        </div>
  </div>
    </div>
    <div className="flex justify-center mt-8">
        <button className="text-white-700 px-4 py-3 bg-gradient-to-t from-sky-400 via-blue-500 to-blue-800 rounded-full hover:text-blue-700 hover:bg-white">More Services</button>
      </div>
  </div>
  </div>
  <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center">
        {/* Left side with images */}
        <div className="md:w-1/2 relative mb-8 md:mb-0">
          <img src={about} alt="Cleaner" className="rounded-full w-80 max-w-md mx-auto border-2 border-pink-500" />
          <div className="absolute top-0 right-0 bg-blue-200 rounded-full p-3">
            <p className="text-3xl font-bold  text-fuchsia-700">25+</p>
            <p className="text-sm text-semibold text-blue-800">YEARS OF EXPERIENCES</p>
          </div>
          <img src={about2} alt="Female Cleaner" className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full border-2 border-blue-500" />
        </div>

        {/* Right side with text content */}
        <div className="md:w-1/2 md:pl-12">
          <h2 className="text-3xl text-center font-semibold text-fuchsia-600 mb-2">ABOUT US</h2>
          <h1 className="text-4xl font-bold text-blue-500 mb-4">Reliable, Affordable & Eco Friendly Providers</h1>
          <p className="text-gray-600 mb-6">
          Providing Reliable, Affordable Services with a Focus on Customer Satisfaction
          </p>

          <div className="space-y-6">
            <div className="flex items-center">
              <div className="bg-gray-200 p-2 rounded-full mr-4">
              <HomeIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Residential Cleaning</h3>
                <p className="text-sm text-blue-600">Reliable Cleaning Services for Residential </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-gray-200 p-2 rounded-full mr-4">
                <FactoryIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Commercial Cleaning</h3>
                <p className="text-sm text-blue-600">Professional Cleaning for commercial Space, Every Need</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-gray-200 p-2 rounded-full mr-4">
                <ExpandCircleDownIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">More Cleaning Services</h3>
                <p className="text-sm text-blue-600">Professional Cleaning for Every Space, Every Need</p>
              </div>
            </div>
          </div>

          <button className="mt-8 bg-gradient-to-t from-sky-400 via-blue-500 to-blue-800 text-black font-semibold py-2 px-6 rounded-full">
            MORE ABOUT US
          </button>
        </div>
      </div>
    </div>

  <div className='w-full h-full bg-gray-100 p-4 mt-8'>
  <h2 className="mt-35 bg-gradient-to-t from-fuchsia-600 to-blue-500 bg-clip-text text-transparent mb-4 text-center font-semibold text-3xl">How to Get in Touch with Service Providers?</h2>

<div className="flex ml-20">

  <div className="max-w-xs hover:animate-wiggle transition-transform bg-gradient-to-r from-fuchsia-400 to-blue-400 border border-blue-500 rounded-lg ml-10 mb-5 mt-5">
      <div className="flex justify-center items-center rounded-t-lg h-40">
          <LoginIcon className='text-blue-800' style={{ fontSize: 90 }}  />
      </div> 
      <div className="p-3">
      <p className="mb-1 font-semibold text-center text-gray-800">Select Location and Date</p>
      </div>
  </div>
  <div className="max-w-xs hover:animate-wiggle bg-gradient-to-r from-fuchsia-400 to-blue-400 border border-blue-500 rounded-lg ml-10 mb-5 mt-5">
      <div className='flex justify-center items-center rounded-t-lg h-40 '>
      <EditCalendarIcon className='text-blue-800' style={{ fontSize: 90 }}  />
      </div> 
      <div className="p-3">
      <p className="mb-1 font-semibold text-center text-gray-800">Customize your booking </p>
      </div>
  </div>
  <div className="max-w-xs hover:animate-wiggle bg-gradient-to-r from-fuchsia-400 to-blue-400 border border-blue-500 rounded-lg ml-10 mb-5 mt-5">
      <div className='flex justify-center items-center rounded-t-lg h-40'>
      <AttachMoneyIcon className='text-blue-800' style={{ fontSize: 90 }}  />
      </div> 
      <div className="p-3">
      <p className="mb-1 font-semibold text-center text-gray-800">Confirm and Make a payment</p>
      </div>
  </div>

  <div className="max-w-xs hover:animate-wiggle bg-gradient-to-r from-fuchsia-400 to-blue-400 border border-blue-500 rounded-lg ml-10 mb-5 mt-5">
      <div className='flex justify-center items-center rounded-t-lg h-40'>
      <SentimentSatisfiedAltIcon className='text-blue-800' style={{ fontSize: 90 }}  />
      </div> 
      <div className="p-3">
      <p className="mb-2 font-semibold text-center text-gray-800">Enjoy our Service </p>
      </div>
  </div>
  </div>
  </div>
  <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-sm font-semibold text-fuchsia-600 mb-2">OUR TEAM</h2>
        <h1 className="text-4xl bg-gradient-to-t from-fuchsia-600 to-blue-500 bg-clip-text text-transparent font-bold mb-4">Our Professional Providers Team</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
        Expert Providers Teams Offering Superior Cleaning for All Your Needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {/* Team Member 1 */}
        <div className="flex flex-col items-center">
          <div className="relative w-60 h-60 mb-4">
            <img src={prof} alt="Merry Powel" className="w-full h-full object-cover rounded-t-full" />
          </div>
          <div className="bg-gradient-to-t from-sky-400 via-blue-500 rounded-b-full pt-3 pb-2 px-12 w-3/4 -mt-8 z-10">
            <AddIcon className='text-blue-600'/>
            <h3 className="font-bold text-center">Merry Powel</h3>
            <p className="text-sm text-center ">MD OF MAIDHERE</p>
          </div>
        </div>

        {/* Team Member 2 */}
        <div className="flex flex-col items-center">
          <div className="relative w-60 h-60  mb-4">
            <img src={prof1} alt="Jonas Paul" className="w-full h-full object-cover rounded-full" />
           
          </div>
          <div className="bg-gradient-to-t from-sky-400 via-blue-500 rounded-b-full pt-3 pb-2 px-12 w-3/4 -mt-8 z-10">
            <AddIcon className='text-blue-600'/>
            <h3 className="font-bold text-center">Madhav Gadgil</h3>
            <p className="text-sm text-center ">MD OF CLEANUP</p>
          </div>
          
        </div>

        {/* Team Member 3 */}
        <div className="flex flex-col items-center">
          <div className="relative w-60 h-60 mb-4">
            <img src={prof} alt="Arina Habbit" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="bg-gradient-to-t from-sky-400 via-blue-500 rounded-b-full pt-3 pb-2 px-8 w-3/4 -mt-8">
          <AddIcon className='text-blue-600'/>
            <h3 className="font-bold text-center">Mathangi Menon</h3>
            <p className="text-sm text-center ">MD OF HEAVYCO</p>
          </div>
        </div>

        {/* Team Member 4 */}
        <div className="flex flex-col items-center">
          <div className="relative w-60 h-60 mb-4">
            <img src={prof1} alt="Harry White" className="w-full h-full object-cover rounded-full" />
           
          </div>
          <div className="bg-gradient-to-t from-sky-400 via-blue-500 rounded-b-full pt-3 pb-2 px-8 w-3/4 -mt-8">
          <AddIcon className='text-blue-600'/>
            <h3 className="font-bold text-center">Gokul Surendran</h3>
            <p className="text-sm text-center ">MD OF CARCARE</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <button className="bg-gradient-to-r from-fuchsia-400 to-blue-500 text-black font-semibold py-3 px-8 rounded-full">
          VIEW ALL PROVIDERS
        </button>
      </div>
    </div>
  <div className="bg-blue-500 text-fuchsia-700 py-6 px-3 md:px-8 relative overflow-hidden">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        {/* Left side content */}
        <div className="md:w-1/2 z-10">
          <h2 className="text-sm font-semibold mb-2">CALL BACK</h2>
          <h1 className="text-2xl md:text-4xl font-semibold mb-4 bg-gradient-to-r from-gray-100 to-white bg-clip-text text-transparent">
            Professional Quality<br />Cleaning With Experts
          </h1>
          <p className="mb-6 text-blue-200">
            Rutrum netus, anim phasellus adipisicing veritatis tincidunt eum
            expedita praesent amet lobortis, cupidatat curae elit elit totam.
          </p>
          
          <div className="flex items-center mb-6">
            <div className="flex -space-x-2 mr-4">
              <img src={man} alt="Client" className="w-10 h-10 rounded-full border-2 border-blue-500" />
              <img src={man} alt="Client" className="w-10 h-10 rounded-full border-2 border-blue-500" />
              <img src={man} alt="Client" className="w-10 h-10 rounded-full border-2 border-blue-500" />
            </div>
            <div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm">Rated 5 Out Of 5 By Our Clients</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <button className="bg-blue-700 text-white font-bold py-3 px-6 rounded-full mb-4 sm:mb-0 sm:mr-4">
              CONTACT US
            </button>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="text-sm">CALL US ANYTIME</p>
                <p className="font-bold">+23 (978) 98 555</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side image */}
        <div className="md:w-1/2 mt-4 md:mt-0">
          <img src={Clean} alt="Cleaner" className="w-90 h-80 object-cover relative z-10" />
        </div>
      </div>
      
      {/* Background shape */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-fuchsia-500 transform skew-x-12 origin-top-right -z-1"></div>
    </div>

</>
    
  
  )
}

export default UserHomeComponent