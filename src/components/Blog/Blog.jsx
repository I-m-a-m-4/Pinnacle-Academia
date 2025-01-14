import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BannerPng from "../../assets/news.png";
import { motion } from "framer-motion";
import { FaArrowRight, FaArrowLeft, FaClock, FaUser } from 'react-icons/fa';
import { blogData } from './blogData';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Blog.css'; // Import custom CSS

const Blog = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePostClick = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
    <section id='blog' className="bg-white py-14 md:py-24">
      <div className="container mx-auto text-center space-y-3">
        <div className="container mx-auto py-14 md:py-14">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-2xl md:text-3xl font-bold text-yellow-700 pb-7">
                Latest News
              </h4>
              <h1 className="text-2xl md:text-4xl font-bold leading-snug md:leading-tight">
                Knowledge is Power, Stay Informed
              </h1>
            </div>
            <div className="flex-1 flex justify-center md:justify-end">
              <motion.img
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                src={BannerPng}
                alt=""
                className="w-[350px] md:max-w-[450px] object-cover drop-shadow"
              />
            </div>
          </div>
        </div>
        <Carousel
          showArrows={true}
          showThumbs={false}
          infiniteLoop={false}
          autoPlay={true}
          interval={5000}
          className="mt-8 custom-carousel"
          centerMode={isDesktop}
          centerSlidePercentage={isDesktop ? 33.33 : 100}
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className={`absolute z-20 left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full arrow-button ${!hasPrev && 'opacity-50 '}`}
              disabled={!hasPrev}
            >
              <FaArrowLeft />
            </button>
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className={`absolute z-20 right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full arrow-button ${!hasNext && 'opacity-50 '}`}
              disabled={!hasNext}
            >
              <FaArrowRight />
            </button>
          }
        >
          {blogData.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-gray-100 p-6 rounded-lg shadow-lg mx-2 w-[90%] md:w-[400px] h-[450px] flex flex-col justify-center items-center text-center z-10"
              onClick={() => handlePostClick(post.id)}
            >
              <div>
                <div className="flex flex-col md:flex-row items-center mb-2 text-gray-600">
                  <div className="flex items-center mb-1 md:mb-0">
                    <FaClock className="mr-2" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUser className="mr-2" />
                    <span>{post.author}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {post.heading}
                </h3>
                <p className="text-dark2 mb-2 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
              <a href={`/blog/${post.id}`} className="text-primary flex items-center mt-2 mb-2">
                Read more <FaArrowRight className="ml-2" />
              </a>
            </motion.div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

export default Blog;