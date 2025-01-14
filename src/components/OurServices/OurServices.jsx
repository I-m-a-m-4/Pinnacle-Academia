import React, { useEffect } from 'react';
import { FaFacebook, FaWhatsapp, FaInstagram, FaTiktok, FaTwitter, FaThumbtack } from 'react-icons/fa';
import bookImage from '../../assets/book.jpg';
import libraryImage from '../../assets/library.jpg';
import exambodies from '../../assets/exambodies.jpg';
import admit from '../../assets/admit.jpg';
import pile from '../../assets/pile.jpg';
import online from '../../assets/online.jpg';
import { IoIosArrowRoundForward } from "react-icons/io";
import pinnacle from '/public/pin-logo.png';
import tutorserv from '../../assets/tutorserv.jpg';
import lexe from '../../assets/lexe.jpg';
import { animate, motion } from "framer-motion";

export const FadeUp = (delay) => {
  return {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.5,
        delay: delay,
        ease: "easeInOut",
      },
    },
  };
};

const OurServices = () => {
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);

    // Scroll to the specific section if the hash is present in the URL
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div><section id="our-services" className="bg-gray-100 py-10 md:py-24 text-center relative border-gray-1000 overflow-hidden custom-border-radius">
    <div className="absolute inset-0 z-0">
      <img src={pile} alt="Pinnacle Logo" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black opacity-40"></div> {/* Dark overlay */}
    </div>
    <div className="container my-10 md:my-20 mx-auto flex flex-col items-center text-center relative z-10">
      <div className="flex-1">
        <h3 className="text-xl md:text-2xl mb-6 font-bold text-white">WHAT WE DO.</h3>
        <h2 className="text-2xl md:text-4xl font-bold text-white">Quality Educational Services Tailored for Excellence.</h2>
        <div className="flex justify-center mt-6">
          <button className="bg-secondary  border-primary hover:border-white border-r-4 p-3 text-primary text-[18px] hover:bg-secondary hover:text-white flex items-center justify-center gap-2 group">
            Get Started
            <IoIosArrowRoundForward className="text-xl group-hover:translate-x-2 group-hover:-rotate-45 duration-300" />
          </button>
        </div>
      </div>
    </div>
  </section>

<style jsx>{`
  .custom-border-radius {
    border-bottom-left-radius: 20%;
  }
`}</style>
      <hr />
      <section   className="bg-gray-100 py-14 md:py-24">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Services</h2>
          <p className="text-base md:text-lg text-gray-700 mb-6">
            We provide a wide range of educational services, including exam registration for local exams like JAMB, WAEC, NECO, POST UTME, JUPEB, IJMB, and other A-Levels Exams. Our offerings include both physical and online tutorials designed to equip students with the knowledge and confidence needed to excel.
          </p>
          <p className="text-base md:text-lg text-gray-700">
            Our holistic approach and proven expertise have established us as a trusted tutorial center, consistently delivering outstanding results and empowering students to achieve their academic aspirations.
          </p>
        </div>
      </section>
      <hr />
      <section className="bg-gray-100 py-14 md:py-24">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Expert Educators</h2>
            <p className="text-base md:text-lg text-gray-700">
              Highly skilled tutors with a passion for teaching and a track record of student success.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Student-Centered Support</h2>
            <p className="text-base md:text-lg text-gray-700">
              Personalized attention to help each student overcome challenges and excel.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Commitment to Excellence</h2>
            <p className="text-base md:text-lg text-gray-700">
              Focused on delivering high-quality education and exceptional student outcomes.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Future-Focused Opportunities</h2>
            <p className="text-base md:text-lg text-gray-700">
              Equipping students with the skills and confidence to navigate their academic and career journeys.
            </p>
          </div>
        </div>
      </section>
      <hr />
      <section className="bg-gray-100 py-14 md:py-24">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center mb-10 bg-white p-6 rounded-lg">
            <img src={exambodies} alt="Local Exam Preparations" className="w-full md:w-1/2 rounded-lg mb-6 md:mb-0 md:mr-6" />
            <div className="flex-1">
              <h5 className="text-lg md:text-xl font-bold text-primary mb-2">01</h5>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Local Exam Preparations</h2>
              <p className="text-base md:text-lg text-gray-700 mb-4">
                Register and prepare for your local exams seamlessly with Pinnacle Academia. Our experienced tutors use proven teaching methods to guide students through:
              </p>
              <ul className="list-disc list-inside text-base md:text-lg text-gray-700 mb-4">
                <li className="flex items-center"><FaThumbtack className="mr-2" />JAMB (Joint Admissions and Matriculation Board)</li>
                <li className="flex items-center"><FaThumbtack className="mr-2" />WAEC (West African Examinations Council)</li>
                <li className="flex items-center"><FaThumbtack className="mr-2" />NECO (National Examinations Council)</li>
                <li className="flex items-center"><FaThumbtack className="mr-2" />GCE (General Certificate of Education)</li>
                <li className="flex items-center"><FaThumbtack className="mr-2" />A Levels (JUPEB, PREDGREE, IJMB and so on.)</li>
              </ul>
              <p className="text-base md:text-lg text-gray-700">
                With personalized attention and consistent practice, we prepare students to excel in these critical exams.
              </p>
              <motion.div
                variants={FadeUp(0.8)}
                initial="initial"
                animate="animate"
                className="flex justify-center md:justify-start"
              >
                <button className="primary-btn flex items-center  mt-3 gap-2 group">
                  Get Started
                  <IoIosArrowRoundForward className="text-xl group-hover:translate-x-2 group-hover:-rotate-45 duration-300" />
                </button>
              </motion.div>
            </div>
          </div>
          <hr />
          <div className="flex flex-col md:flex-row items-center mb-10 bg-gray-100 p-6 rounded-lg">
            <img src={online} alt="Online Educational Services" className="w-full md:w-1/2 rounded-lg mb-6 md:mb-0 md:mr-6" />
            <div className="flex-1">
              <h5 className="text-lg md:text-xl font-bold text-primary mb-2">02</h5>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Online Educational Services</h2>
              <p className="text-base md:text-lg text-gray-700 mb-4">
                For students near and far, our online tutorials offer flexible learning options for various exams and levels:
              </p>
              <ul className="list-disc list-inside text-base md:text-lg text-gray-700 mb-4">
                <li className="flex items-center"><FaThumbtack className="mr-2" />JAMB, WAEC, NECO, and A Levels</li>
                <li className="flex items-center"><FaThumbtack className="mr-2" />IGCSE (International General Certificate of Secondary Education)</li>
                <li className="flex items-center"><FaThumbtack className="mr-2" />Basic Level Classes (Year 7-11)</li>
                <li className="flex items-center"><FaThumbtack className="mr-2" />GCSE (General Certificate of Secondary Education)</li>
              </ul>
              <p className="text-base md:text-lg text-gray-700">
                Experience engaging lessons, expert guidance, and accessible resources from the comfort of your home.
              </p>
              <motion.div
                variants={FadeUp(0.8)}
                initial="initial"
                animate="animate"
                className="flex justify-center md:justify-start"
              >
                <button className="primary-btn flex items-center mt-3 gap-2 group">
                  Get Started
                  <IoIosArrowRoundForward className="text-xl group-hover:translate-x-2 group-hover:-rotate-45 duration-300" />
                </button>
              </motion.div>
            </div>
          </div>
          <hr />
          <div className="flex flex-col md:flex-row items-center mb-10 bg-white p-6 rounded-lg">
            <img src={admit} alt="Admission Consultation and Processing" className="w-full md:w-1/2 rounded-lg mb-6 md:mb-0 md:mr-6" />
            <div className="flex-1">
              <h5 className="text-lg md:text-xl font-bold text-primary mb-2">03</h5>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Admission Consultation and Processing</h2>
              <p className="text-base md:text-lg text-gray-700 mb-4">
                Let us help you turn your dreams into reality with our comprehensive admission processing services. With a proven track record, we assist students in securing:
              </p>
              <ul className="list-disc list-inside text-base md:text-lg text-gray-700 mb-4">
                <li className="flex items-center"><FaThumbtack className="mr-2" />Admission into top Nigerian universities like OAU, UI, UNILAG, UNIZIK, ABU, UNILORIN, UNN, and UNIBEN</li>
                <li className="flex items-center"><FaThumbtack className="mr-2" />Admission into top universities in the USA, UK, Canada, Europe, and Australia</li>
                <li className="flex items-center"><FaThumbtack className="mr-2" />Scholarships for eligible candidates</li>
                <li className="flex items-center"><FaThumbtack className="mr-2" />Visa application guidance for a smooth transition to studying abroad</li>
              </ul>
              <motion.div
                variants={FadeUp(0.8)}
                initial="initial"
                animate="animate"
                className="flex justify-center md:justify-start"
              >
                <button className="primary-btn flex items-center mt-3 gap-2 group">
                  Get Started
                  <IoIosArrowRoundForward className="text-xl group-hover:translate-x-2 group-hover:-rotate-45 duration-300" />
                </button>
              </motion.div>
            </div>
          </div>
          <hr />
          <div className="flex flex-col md:flex-row items-center bg-gray-100 p-6 rounded-lg">
            <img src={tutorserv} alt="International Exams Preparation" className="w-full md:w-1/2 rounded-lg mb-6 md:mb-0 md:mr-6" />
            <div className="flex-1">
              <h5 className="text-lg md:text-xl font-bold text-primary mb-2">04</h5>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">International Exams Preparation</h2>
              <p className="text-base md:text-lg text-gray-700 mb-4">
                Looking to study abroad? Pinnacle Academia offers preparation services for international exams, opening doors to global opportunities. Our services include:
              </p>
              <ul className="list-disc list-inside text-base md:text-lg text-gray-700 mb-4">
                <li className="flex items-center"><FaThumbtack className="mr-2" />IELTS (International English Language Testing System)</li>
                <li className="flex items-center"><FaThumbtack className="mr-2" />TOEFL (Test of English as a Foreign Language)</li>
                <li className="flex items-center"><FaThumbtack className="mr-2" />SAT (Scholastic Assessment Test)</li>
                <li className="flex items-center"><FaThumbtack className="mr-2" />GRE (Graduate Record Examination)</li>
              </ul>
              <p className="text-base md:text-lg text-gray-700">
                Our tailored programs are designed to help students achieve competitive scores and secure admission to world-class universities.
              </p>
              <motion.div
                variants={FadeUp(0.8)}
                initial="initial"
                animate="animate"
                className="flex justify-center md:justify-start"
              >
                <button className="primary-btn flex items-center mt-3 gap-2 group">
                  Get Started
                  <IoIosArrowRoundForward className="text-xl group-hover:translate-x-2 group-hover:-rotate-45 duration-300" />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurServices;