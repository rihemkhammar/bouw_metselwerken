import React from "react";
import { assets } from "../../../assets/assets";



const About = () => {
  return (
    <div id="About" className="w-full bg-[var(--standard-off-white)] py-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT IMAGE */}
        <div className="relative">
          <img
            src={assets.background3}
            alt="About our construction company"
            className="rounded-lg shadow-lg object-cover w-full h-[350px]"
          />

          {/* ORANGE ACCENT BAR */}
          <div className="absolute -bottom-4 -left-4 w-32 h-2 bg-[#f16c13] rounded-full"></div>
        </div>

        {/* RIGHT TEXT */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Building With Quality, Integrity & Precision
          </h2>

          <p className="text-gray-600 leading-relaxed mb-6">
            With over a decade of experience, our team delivers top‑tier
            construction services for residential and commercial projects. We
            combine craftsmanship, modern technology, and strong project
            management to bring your vision to life.
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            From renovations and custom builds to large‑scale developments, we
            ensure every project is completed on time, on budget, and with
            exceptional attention to detail.
          </p>


        </div>
      </div>
    </div>
  );
}
export default About;

/*
    <motion.div initial={{opacity:0 , x:200}} transition={{duration:1}} whileInView={{opacity:1 , x:0}} viewport={{once:true}}className='flex flex-col items-center justify-center conatiner mx-auto p-14 md:px-20 lg:px-32 w-full overflow-hidden' id='About'>
        <h1 className='text-2xl sm:text-4xl font-bold mb-2'>About <span className='underline underline-offset-4 decoration-1 under font-light'>Our Brand</span></h1>
        <p className='text-gray-500 max-w-80 text-center mb-8'>Passionate About Properties, Dedicated to Your Vision</p>
        <div className='flex flex-col md:flex-row items-center md:items-start md:gap-20'>
            <img src={assets.logo} alt='' className='w-full sm:w-1/2 max-w-lg'></img>
            <div className='flex flex-col items-center md:items-start mt-10 text-gray-600'>
                <div className='grid grid-cols-2 gap-6 md:gap-10 w-full 2xl:pr-28'>
                 <div>
                    <p className='text-4xl font-medium text-gray-800'>
                        10+
                    </p>
                    <p> 
                        Years of Excellence
                    </p>
                 </div>
                            <div>
                    <p className='text-4xl font-medium text-gray-800'>
                        12+
                    </p>
                    <p> 
                       Projects Completed
                    </p>
                 </div>
                            <div>
                    <p className='text-4xl font-medium text-gray-800'>
                        20+
                    </p>
                    <p> 
                        Mn. Sq. Ft. Delivered
                    </p>
                 </div>
                            <div>
                    <p className='text-4xl font-medium text-gray-800'>
                        25+
                    </p>
                    <p> 
                       Ongoing Projects
                    </p>
                 </div>
                </div>
                    <p className='my-10 max-w-lg'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                 </p>
                 <button className='bg-blue-600 text-white px-8 py-2 rounded'>Learn More</button>

            </div>
        </div>
      
    </motion.div>
  )*/
