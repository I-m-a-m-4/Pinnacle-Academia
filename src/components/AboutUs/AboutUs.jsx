import React, {useEffect }  from 'react';
import { FaFacebook, FaWhatsapp, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';
import bookImage from '../../assets/book.jpg';
import libraryImage from '../../assets/pile.jpg';
import founderImage from '../../assets/founder.jpg';
import excellence from '../../assets/frut.jpg';
import girl from '../../assets/girl.jpg';
import pinnacle from '/public/pin-logo.png';
import { IoIosArrowRoundForward } from "react-icons/io";
import lexe from '../../assets/about.jpg';

const AboutUs = () => {
  
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
    <div> 
<section id='about-us' className="bg-gray-100 py-10 md:py-24 text-center relative  border-gray-1000 overflow-hidden custom-border-radius">
    <div className="absolute inset-0 z-0">
      <img src={lexe} alt="Pinnacle Logo" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black opacity-40"></div> {/* Dark overlay */}
    </div>
    <div className="container my-10 md:my-20 mx-auto flex flex-col items-center text-center relative z-10">
      <div className="flex-1">
        <h3 className="text-xl md:text-2xl mb-6 font-bold text-white">WHO WE ARE.</h3>
        <h2 className="text-2xl md:text-4xl font-bold text-white">A Community of Excellence,</h2>
        <div className="flex justify-center mt-6">
          <button className="bg-secondary  border-primary hover:border-white border-r-4 p-3 text-primary text-[18px] hover:bg-secondary hover:text-white flex items-center justify-center gap-2 group">
            Learn More
            <IoIosArrowRoundForward className="text-xl group-hover:translate-x-2 group-hover:-rotate-45 duration-300" />
          </button>
        </div>
      </div>
    </div>
  </section>

<style jsx>{`
  .custom-border-radius {
    border-bottom-left-radius: 020%;
  }
`}</style>
      <section className="bg-gray-100 py-14 md:py-24">
        <div className="container mx-auto flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">About us</h2>
            <h3 className="text-xl mb-4">Welcome to Pinnacle Academia, a dedicated, and innovative educational community.</h3>
            <p className="text-lg text-gray-700">
              At Pinnacle Academia, we believe that education is the key to unlocking individual potentials.
              Founded on the belief that every student has the potential to excel, we offer personalized,
              innovative, and comprehensive educational support that caters to diverse academic needs.
            </p>
          </div>
          <div className="flex-1">
            <img src={pinnacle} alt="College" className="w-full rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-24">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Our Approach</h2>
          <div className="flex flex-col md:flex-row items-center mb-10">
            <img src={excellence} alt="Excellence" className="w-full md:w-1/2 rounded-lg shadow-lg mb-6 md:mb-0 md:mr-6" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Academic Excellence at its Best</h3>
              <p className="text-lg text-gray-700">
                Through personalized tutorials, innovative teaching methods, and a supportive environment, we equip students with the tools they need to embrace challenges and achieve academic excellence. Pinnacle Academia strives to be a beacon of guidance for learners, illuminating their journey toward success and lifelong growth.
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse md:flex-row items-center">
  <div className="flex-1 md:mr-6">
    <h3 className="text-2xl font-bold mb-4">Inspiring the Next Generation</h3>
    <p className="text-lg text-gray-700">
      Our mission is reflected in our commitment to transforming ordinary students into exceptional achievers. At Pinnacle Academia, we go beyond education to build resilience, character, and self-belief in every learner.
    </p>
  </div>
  <img src={libraryImage} alt="Generation" className="w-full md:w-1/2 rounded-lg shadow-lg mt-6 md:mt-0" />
</div>
        </div>
      </section>

      <section className="bg-gray-100 py-14 md:py-24">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Key Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Excellence</h3>
              <p className="text-lg text-gray-700">
                We are committed to delivering outstanding education and services, ensuring every student achieves their full potential through quality and education.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Innovation</h3>
              <p className="text-lg text-gray-700">
                Embracing cutting-edge teaching methods and technology, we create engaging and effective learning experiences.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Supportive Community</h3>
              <p className="text-lg text-gray-700">
                We nurture a welcoming and collaborative environment where students, educators, and stakeholders feel valued, empowered, and inspired to succeed.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Global Citizenship</h3>
              <p className="text-lg text-gray-700">
                Preparing students to navigate and contribute meaningfully to the interconnected global community, we instill values of responsibility, adaptability, and cross-cultural understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-24">
        <div className="container mx-auto text-center">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-4">OUR VISION</h2>
            <p className="text-lg text-gray-700">
              Our Vision is to ignite a passion for learning and equip students to achieve excellence, through empowering students with the knowledge and skills they need to succeed academically and professionally.
            </p>
          </div>
          <hr className="my-10" />
          <div>
            <h2 className="text-3xl font-bold mb-4">OUR MISSION</h2>
            <p className="text-lg text-gray-700">
              Our Mission is to provide high-quality academic programs, resources, and support services that foster academic excellence, personal growth, and professional success.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-14 md:py-24">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">MEET THE MANAGEMENT</h2>
          <img src={founderImage} alt="Founder" className="w50 h-45 rounded-md mx-auto mb-4" />
          <div>
            <h3 className="text-2xl font-bold">Akinola Ibrahim</h3>
            <em>Founder</em>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;