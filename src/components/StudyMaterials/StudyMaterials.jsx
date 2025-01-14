import React from 'react';
import { FaFacebook, FaWhatsapp, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';
import study from '../../assets/bukl.png';
import Blob from "../../assets/blob.svg";
import { animate, motion } from "framer-motion";

const StudyMaterials = () => {
  const subjects = [
    { name: 'Use of English', syllabusLink: '/syllabus/english', pastQuestionsLink: '/past-questions/english' },
    { name: 'Mathematics', syllabusLink: '/syllabus/mathematics', pastQuestionsLink: '/past-questions/mathematics' },
    { name: 'Chemistry', syllabusLink: '/syllabus/chemistry', pastQuestionsLink: '/past-questions/chemistry' },
    { name: 'Biology', syllabusLink: '/syllabus/biology', pastQuestionsLink: '/past-questions/biology' },
    { name: 'Physics', syllabusLink: '/syllabus/physics', pastQuestionsLink: '/past-questions/physics' },
    { name: 'Literature', syllabusLink: '/syllabus/literature', pastQuestionsLink: '/past-questions/literature' },
    { name: 'Economics', syllabusLink: '/syllabus/economics', pastQuestionsLink: '/past-questions/economics' },
    { name: 'Christian Religious Knowledge', syllabusLink: '/syllabus/crk', pastQuestionsLink: '/past-questions/crk' },
    { name: 'Islamic Religious Knowledge', syllabusLink: '/syllabus/irk', pastQuestionsLink: '/past-questions/irk' },
    { name: 'Government', syllabusLink: '/syllabus/government', pastQuestionsLink: '/past-questions/government' },
    { name: 'Commerce', syllabusLink: '/syllabus/commerce', pastQuestionsLink: '/past-questions/commerce' },
    { name: 'Geography', syllabusLink: '/syllabus/geography', pastQuestionsLink: '/past-questions/geography' },
    { name: 'Financial Accountings', syllabusLink: '/syllabus/accounting', pastQuestionsLink: '/past-questions/accounting' },
  ];

  return (
    <div>
      <section className="bg-white py-20 md:py-24 text-center relative">
        <div className="container my-10 mx-auto flex flex-col md:flex-row items-center text-center md:text-left relative z-10">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl mb-4 md:mb-7 font-bold text-primary">STUDY MATERIAL.</h3>
            <h2 className="text-2xl md:text-5xl font-bold text-secondary">
              Access essential resources{" "}
              <span className="block md:inline">to enhance your learning and exam prep.</span>
            </h2>
            <button className="primary-btn mt-4 md:mt-9">Get in touch</button>
          </div>
          <div className="flex justify-center items-center">
            <motion.img
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
              src={study}
              alt=""
              className="w-[400px] xl:w-[600px] relative z-10 drop-shadow"
            />
            <motion.img
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
              src={Blob}
              alt=""
              className="absolute -bottom-32 w-[800px] md:w-[1500px] z-[1] hidden md:block"
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-14 md:py-24">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Study Material</h2>
          <p className="text-lg text-gray-700 mb-6">
            At Pinnacle Academia, we are committed to providing students with the tools they need to excel in their academic journey.
          </p>
        </div>
      </section>

      <section className="bg-white py-14 md:py-24">
        <div className="container mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-center mb-4">JAMB Syllabus</h2>
            <p className="text-lg text-gray-700 text-center mb-6">Click on the subjects below to access each JAMB syllabus</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map(subject => (
                <a href={subject.syllabusLink} key={subject.name} className="block bg-gray-100 p-4 rounded-lg shadow-lg text-center text-primary hover:text-secondary">
                  {subject.name}
                </a>
              ))}
            </div>
          </div>
          <hr className="my-10" />
          <div>
            <h2 className="text-3xl font-bold text-center mb-4">JAMB Past Questions</h2>
            <p className="text-lg text-gray-700 text-center mb-6">Click on the subjects below to access each JAMB Past questions</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map(subject => (
                <a href={subject.pastQuestionsLink} key={subject.name} className="block bg-gray-100 p-4 rounded-lg shadow-lg text-center text-primary hover:text-secondary">
                  {subject.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudyMaterials;