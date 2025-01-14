import React from 'react';
import { motion } from 'framer-motion';
import excellenceImage from '../../assets/pile.jpg'; 
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from 'react-router-dom';

const WhoWeAre = () => {
  return (
    <section className="relative bg-gray-100 py-30 md:py-24 text-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${excellenceImage})`, backgroundAttachment: 'fixed' }}
      >
        <div className="absolute inset-0 bg-black opacity-35"></div> 
      </div>
      <div className="container my-5 mx-auto flex flex-col items-center text-center relative z-10">
        <motion.h3 
          className="text-3xl md:text-4xl font-bold text-primary mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          WHO WE ARE
        </motion.h3>
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          A COMMUNITY OF EXCELLENCE
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-white max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          We foster a culture of academic excellence and character development, leveraging innovative testing methods and research-driven development.
        </motion.p>
             <Link
      to="/about-us#about-us"
     className="bg-secondary mt-6 border-primary hover:border-white border-r-4 p-3 text-primary text-[18px]  hover:bg-secondary hover:text-white flex items-center justify-center gap-2 group"
    >
      Learn more
      <IoIosArrowRoundForward className="text-xl group-hover:translate-x-2 group-hover:-rotate-45 duration-300" />    </Link>
      </div>
        
    </section>
  );
};

export default WhoWeAre;