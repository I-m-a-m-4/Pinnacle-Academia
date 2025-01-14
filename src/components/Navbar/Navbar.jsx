import React, { useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

import pinnacle from "../../assets/erc.png";
const NavbarMenu = [
  {
    id: 1,
    title: "Home",
    path: "/",
  },
  {
    id: 2,
    title: "About Us",
    path: "/about-us",
  },
  {
    id: 3,
    title: "Our Services",
    path: "/our-services",
  },
  {
    id: 4,
    title: "Study Materials",
    path: "/study-materials",
  },
  {
    id: 5,
    title: "Latest News",
    path: "/latest-news",
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="relative z-20">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-3 flex justify-between items-center"
      >
        {/* Logo section */}
        <div className="flex items-center">
          <img
            src={pinnacle}
            alt="pinnacle acaedemia logo"
            className="w-16 h-16 lg:w-20 lg:h-20"
          /><h1 className="font-bold text-xl md:text-2xl cursor-pointer ml-4 whitespace-nowrap">
          Pinnacle Academia
        </h1>        </div>
        {/* Menu section */}
        <div className="hidden lg:block">
          <ul className="flex z-20 items-center gap-3">
            {NavbarMenu.map((menu) => (
              <li key={menu.id}>
                <Link
                  to={menu.path}
                  className={`inline-block cursor-pointer z-20 py-2 px-3 relative group ${
                    location.pathname === menu.path ? 'text-[#032b44]' : ''
                  }`}
                >
                  <div
                    className={`w-2 h-2 z-20 cursor-pointer bg-[#032b44] absolute mt-4 rounded-full left-1/2 -translate-x-1/2 top-1/2 bottom-0 ${
                      location.pathname === menu.path ? 'block' : 'hidden'
                    }`}
                  ></div>
                  {menu.title}
                </Link>
              </li>
            ))}
            <button className="primary-btn">Enroll Now</button>
          </ul>
        </div>
        {/* Mobile Hamburger menu section */}
        <div className="lg:hidden">
          <button onClick={toggleMenu}>
            {isMenuOpen ? <IoMdClose className="text-4xl" /> : <IoMdMenu className="text-4xl" />}
          </button>
        </div>
      </motion.div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg absolute top-20 left-0 right-0 z-10">
          <ul className="flex flex-col items-center gap-3 py-5">
            {NavbarMenu.map((menu) => (
              <li key={menu.id}>
                <Link
                  to={menu.path}
                  className={`inline-block cursor-pointer py-2 px-3 relative group ${
                    location.pathname === menu.path ? 'text-[#032b44]' : ''
                  }`}
                  onClick={toggleMenu}
                >
                  <div
                    className={`w-2 h-2 cursor-pointer bg-[#032b44] absolute mt-4 rounded-full left-1/2 -translate-x-1/2 top-1/2 bottom-0 ${
                      location.pathname === menu.path ? 'block' : 'hidden'
                    }`}
                  ></div>
                  {menu.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;