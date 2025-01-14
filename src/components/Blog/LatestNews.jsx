import React, { useState } from 'react';
import { FaArrowRight, FaComment, FaSearch, FaUser } from 'react-icons/fa';
import { blogData } from './blogData';

const LatestNews = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBlogData = blogData.filter((post) =>
    post.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="bg-white py-14 md:py-24">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Latest News</h1>
        <p className="text-lg text-gray-700 mb-6">
          Stay updated with the latest news and updates from Pinnacle Academia.
        </p>
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:w-1/2 p-2 border border-gray-300 rounded-l"
          />
          <button className="bg-primary text-white p-2 rounded-r">
            <FaSearch />
          </button>
        </div>
        {filteredBlogData.map((post) => (
          <div key={post.id} className="mb-10 p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">{post.heading}</h2>
            <div className="flex flex-col md:flex-row justify-center items-center text-gray-600 mb-2">
              <div className="flex items-center mb-1 md:mb-0">
                <FaUser className="mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center mb-1 md:mb-0">
                <span className="mx-2">|</span>
                <FaComment className="mr-2" />
                <span>{post.comments ? post.comments.length : 0} Comments</span>
              </div>
              <div className="flex items-center">
                <span className="mx-2">|</span>
                <span>{post.date}</span>
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-4">{post.excerpt}</p>
            <a href={post.link} className="text-primary flex items-center justify-center">
              Read more <FaArrowRight className="ml-2" />
            </a>
            <hr className="my-6 border-gray-300" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestNews;