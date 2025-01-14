import React from "react";
import BannerPng from "/public/pin-logo.png";
import { motion } from "framer-motion";

const Banner2 = () => {
  return (<section>
    <div className="container mx-auto py-14 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 space-y-6 md:space-y-0">
      {/* Banner Image */}
      <div className="flex justify-center items-center">
        <motion.img
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          src={BannerPng}
          alt=""
          className="w-[350px] md:max-w-[450px] object-cover drop-shadow"
        />
      </div>
      {/* Banner Text */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="flex flex-col justify-center items-center md:items-start"
      >
        <div className="text-center md:text-left space-y-4 lg:max-w-[450px]">
          <h1 className="text-2xl md:text-4xl font-bold leading-snug md:leading-tight">
            Join Our Community to Start your Journey
          </h1>
          <p className="text-base md:text-lg text-dark2">
            We foster a culture of academic excellence and character development,
            leveraging innovative teaching methods and research-driven strategies
          </p>
          <a target="blank"
            href="https://wa.me/qr/FQ6U4PYYZA7RD1"
            className="primary-btn mt-4 md:mt-8"
          >
            Join Now
          </a>
        </div>
      </motion.div>
    </div>
  </section>
  );
};

export default Banner2;
