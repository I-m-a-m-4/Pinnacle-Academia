import React from "react";
import { RiComputerLine, RiBookOpenLine } from "react-icons/ri";
import { CiMobile3 } from "react-icons/ci";
import { TbWorldWww } from "react-icons/tb";
import { IoMdHappy, IoMdSchool } from "react-icons/io";
import { BiSupport, BiBookBookmark } from "react-icons/bi";
import { IoPulseOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import './Services.css'; // Import custom CSS for background shapes

const ServicesData = [
  {
    id: 1,
    title: "Online Classes",
    excerpt: "Our intensive rigorous classes cover various subjects, offering flexibility and convenience for students to learn at their comfort zone. We provide expert instruction and quality tutorial for JAMB, WAEC, NECO, JUBEP, IJMB, SAT, IELTS.",
    icon: <RiBookOpenLine />,
    delay: 0.2,
  },
  {
    id: 2,
    title: "Exam Registration",
    excerpt: "Register for Local Exams (JAMB, NECO, POST-UTME, JUBEP) and international exams (SAT, IELTS, GRE, GMAT) with our user-friendly platform. Our support team is always available to assist.",
    icon: <BiBookBookmark />,
    delay: 0.3,
  },
  {
    id: 3,
    title: "Physical Classes",
    excerpt: "Our well-equipped centers offer in-person classes, providing hands-on tutoring and interaction with experienced and qualified tutors for a comprehensive learning experience.",
    icon: <IoMdSchool />,
    delay: 0.4,
  },
  {
    id: 4,
    title: "Admission Processing",
    excerpt: "We navigate the admission process with students, from application to acceptance, securing spots in top universities and institutions through personalized support.",
    icon: <IoMdHappy />,
    delay: 0.5,
  },
];

const SlideLeft = (delay) => {
  return {
    initial: {
      opacity: 0,
      x: 50,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: delay,
        ease: "easeInOut",
      },
    },
  };
};

const Services = () => {
  return (
    <section className="bg-white relative">
      <div className="container pb-14 pt-16">
      <h4 className="text-xl md:text-1.2xl font-bold text-yellow-700 text-left pb-3 leading-tight">
  WHAT WE OFFER
</h4>
<h2 className="text-3xl md:text-4.5xl  text-left pb-1 leading-tight">
  Empowering Students' Academic Growth
</h2>
<br />
<h4 className="text-xl md:text-xl  text-left pb-3 mb-4 leading-tight">
  Our Services include the following.
</h4>
        <div className="grid grid-cols-1 cursor-pointer sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
          {ServicesData.map((service) => (
            <motion.div
              key={service.id}
              variants={SlideLeft(service.delay)}
              initial="initial"
              whileInView={"animate"}
              viewport={{ once: true }}
              className="bg-[#f4f4f4] rounded-2xl cursor-pointer flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl max-w-xs"
            >
              <div className="text-4xl text-left mb-4"> {service.icon}</div>
              <h1 className="text-lg text-left font-semibold px-3">
                {service.title}
              </h1>
              <p className=" text-dark2 text-left px-3">
                {service.excerpt}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="background-shapes"></div>
    </section>
  );
};

export default Services;