import React from 'react';
import '../bubbles.css'; // Ensure this path is correct
import home1 from '../Images/home11.png'
import {motion} from 'framer-motion'

const services = ['Home Cleaning', 'Office Cleaning', 'Carpet Cleaning', 'Window Cleaning'];
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
  




const Bubbles = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gray-100">
         <div className="relative z-10">
         <motion.img initial={{opacity:0,rotate:20,x:200, y:100}} whileInView={{opacity:1,rotate:0,x:0,y:0}}
         transition={{duration:2.5}}
         src={home1} alt="alt" className='h-[550px] img-shadow '/>
          
         </div>
      {services.map((service, index) => (
        <div key={index} className={`bubble bubble-${index}`}>
          <div className="bubble-text">{service}</div>
        </div>
      ))}
    </div>
  );
}

export default Bubbles;
