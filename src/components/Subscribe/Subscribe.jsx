import React from "react";
import { FaArrowRight } from "react-icons/fa";
import BgImage from "../../assets/JAMBA.png";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
const bgStyle = {
  backgroundImage: `url(${BgImage})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const Subscribe = () => {
  return (
    <section className="bg-[#f7f7f7]">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        style={bgStyle}
        className="container py-24 md:py-48"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="flex flex-col justify-center"
        >
          <div className="text-center space-y-4 lg:max-w-[930px] mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold leading-snug md:leading-tight">
  Empowering Thousands of Students to Excel in JAMB, Post-UTME, WAEC, NECO, and More
</h1>
<p className="text-base md:text-lg text-dark2 mb-4">
  At Pinnacle Academia, we provide expert guidance and personalized support to help students excel in exams like JAMB, Post-UTME, WAEC, and NECO, empowering them to achieve their academic goals with confidence.
</p>
<Link
      to="/our-services#our-services"
      className="primary-btn mt-4 md:mt-8 inline-flex items-center gap-4 group"
    >
      Explore more
      <FaArrowRight className="group-hover:animate-bounce group-hover:text-lg duration-200 transform group-hover:translate-x-2" />
    </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Subscribe;
