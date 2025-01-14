import React, { useRef } from "react";
import { FaInstagram, FaWhatsapp, FaTiktok, FaTwitter, FaFacebook } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import pinnacle from "/public/pin-logo.png";
import { motion } from "framer-motion";

const Footer = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, 'YOUR_USER_ID')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });

    e.target.reset();
  };

  return (
    <footer className="py-28 bg-[#f7f7f7]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="container"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 md:gap-4">
          {/* first section */}
          <div className="space-y-4 max-w-[300px]">
            <div className="flex items-center space-x-4">
              <img src={pinnacle} alt="Pinnacle" className="w-20" />
              <h1 className="text-2xl font-bold">Pinnacle Academia</h1>
            </div>
            <p className="text-dark2">
              Transforming Lives through Education.
              As a vibrant community of learning enthusiasts, we strive to make education accessible, affordable, and rewarding for all. Join us in shaping the future of education.
            </p>
          </div>
          {/* second section */}
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">News</h1>
              <div className="text-dark2">
                <ul className="space-y-2 text-lg">
                  <li className="cursor-pointer hover:text-secondary duration-200">
                    Waec/Jamb News
                  </li>
                  <li className="cursor-pointer hover:text-secondary duration-200">
                    Admission News
                  </li>
                  <li className="cursor-pointer hover:text-secondary duration-200">
                    Post-Utme/Screening News
                  </li>
                  <li className="cursor-pointer hover:text-secondary duration-200">
                    Scholarship and Opportunities
                  </li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Overview</h1>
              <div className="text-dark2">
                <ul className="space-y-2 text-lg">
                  <li className="cursor-pointer hover:text-b duration-200">
                    Our Services
                  </li>
                  <li className="cursor-pointer hover:text-secondary duration-200">
                    Get in touch
                  </li>
                  <li className="cursor-pointer hover:text-secondary duration-200">
                    News and updates
                  </li>
                  <li className="cursor-pointer hover:text-secondary duration-200">
                    Resources
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* third section */}
          <div className="space-y-4 max-w-[300px]">
            <h1 className="text-2xl font-bold">Get In Touch</h1>
            <form ref={form} onSubmit={sendEmail} className="flex items-center">
              <input
                type="email"
                name="user_email"
                placeholder="Enter your email"
                className="p-3 rounded-s-xl bg-white w-full py-4 focus:ring-0 focus:outline-none placeholder:text-dark2"
                required
              />
              <button type="submit" className="bg-primary text-white font-semibold py-4 px-6 rounded-e-xl">
                Go
              </button>
            </form>
            <div className="flex space-x-6 py-3">
              <ul className="text-dark2">
                <li className="cursor-pointer hover:text-secondary duration-200">Lagos & Osun state Nigeria.</li>
                <li className="cursor-pointer hover:text-secondary duration-200">pinnacleacademia254@gmail.com</li>
              </ul>
            </div>
            {/* social icons */}
            <div className="flex space-x-6 py-3">
              <a href="https://www.facebook.com/profile.php?id=61551810880578">
                <FaFacebook className="cursor-pointer hover:text-primary hover:scale-105 duration-200" />
              </a>
              <a href="https://wa.me/qr/FQ6U4PYYZA7RD1">
                <FaWhatsapp className="cursor-pointer hover:text-primary hover:scale-105 duration-200" />
              </a>
              <a href="https://www.instagram.com/pinnacleacademia?igsh=YzljYTk1ODg3Zg== ">
                <FaInstagram className="cursor-pointer hover:text-primary hover:scale-105 duration-200" />
              </a>
              <a href="https://vm.tiktok.com/ZMkDEVmuB/">
                <FaTiktok className="cursor-pointer hover:text-primary hover:scale-105 duration-200" />
              </a>
              <a href="https://x.com/PinnacleAc47813?t=ZbkVjART-Fx4TAlAbUy5AQ&s=09">
                <FaTwitter className="cursor-pointer hover:text-primary hover:scale-105 duration-200" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-300 pt-6 text-center text-dark2">
          <p>Copyright © 2025 Pinnacle Academia</p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;