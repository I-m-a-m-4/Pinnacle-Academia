import React, { useState, useEffect } from 'react';
import { FaClock, FaReply, FaArrowRight, FaArrowLeft, FaUser } from 'react-icons/fa';
import { db } from '../../../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { blogData } from './blogData';
import { motion } from 'framer-motion';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event) => setMatches(event.matches);
    mediaQueryList.addListener(listener);
    return () => mediaQueryList.removeListener(listener);
  }, [query]);

  return matches;
};

const BlogPost4 = () => {
  const postId = '4';
  const [comments, setComments] = useState([]);
  const [commentData, setCommentData] = useState({
    name: '',
    email: '',
    comment: '',
    parentId: null
  });
  const [replyTo, setReplyTo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clickedReply, setClickedReply] = useState(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsArray = [];
      querySnapshot.forEach((doc) => {
        commentsArray.push({ ...doc.data(), id: doc.id });
      });
      setComments(commentsArray);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCommentData({ ...commentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        ...commentData,
        postId: postId,
        timestamp: new Date()
      });
      setCommentData({ name: '', email: '', comment: '', parentId: null });
      setReplyTo(null);
      setClickedReply(null);
    } catch (error) {
      console.error('Error adding comment: ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId) => {
    if (clickedReply === commentId) {
      setReplyTo(null);
      setCommentData({ ...commentData, parentId: null });
      setClickedReply(null);
    } else {
      setReplyTo(commentId);
      setCommentData({ ...commentData, parentId: commentId });
      setClickedReply(commentId);
    }
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      setReplyTo(null);
      setCommentData({ ...commentData, parentId: null });
      setClickedReply(null);
    }
  };

  const renderComments = (parentId = null, level = 0) => {
    return comments
      .filter(comment => comment.postId === postId && comment.parentId === parentId)
      .map(comment => (
        <div key={comment.id} className={`mb-4 p-4 border border-gray-300 rounded ${level > 0 ? 'ml-8' : ''}`}>
          <div className="flex justify-between items-center mb-2">
            <div>
              <h4 className="font-bold">{comment.name}</h4>
              <p className="text-sm text-gray-600">{comment.email}</p>
            </div>
            <span className="text-sm text-gray-600">
              {new Date(comment.timestamp.seconds * 1000).toLocaleDateString()} {new Date(comment.timestamp.seconds * 1000).toLocaleTimeString()}
            </span>
          </div>
          <p>{comment.comment}</p>
          <button
            className={`mt-2 flex items-center ${replyTo === comment.id ? 'text-[#032b44]' : 'text-primary'}`}
            onClick={() => handleReply(comment.id)}
            disabled={isSubmitting}
          >
            <FaReply className="mr-2" /> Reply
          </button>
          {renderComments(comment.id, level + 1)}
        </div>
      ));
  };

  const post = blogData.find(post => post.id === parseInt(postId));

  return (
    <section className="bg-white py-14 md:py-24" onClick={handleBackgroundClick}>
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-primary">{post.heading}</h1>
          <div className="flex items-center justify-center text-gray-600 mt-4">
            <FaClock className="mr-2" />
            <span>{post.date}</span>
            <span className="mx-2">|</span>
            <FaUser className="mr-2" />
            <span>{post.author}</span>
          </div>
        </div>
        <div className="prose mx-auto mb-10">
          <p className="text-base md:text-lg">{post.excerpt}</p>
        </div>
        <div className="comment-section">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          {renderComments()}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <input
                type="text"
                name="name"
                value={commentData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={commentData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                name="comment"
                value={commentData.comment}
                onChange={handleInputChange}
                placeholder="Your Comment"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className={`p-2 rounded ${isSubmitting ? 'bg-[#032b44] text-white' : 'bg-primary text-white'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
        <div className="mt-10">
          <h2 className="text-3xl font-bold mb-6">Recent Blogs</h2>
          <Carousel
            showArrows={true}
            showThumbs={false}
            infiniteLoop={false}
            autoPlay={true}
            interval={5000}
            className="custom-carousel"
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
                className="bg-gray-100 p-6 rounded-lg shadow-lg mx-2 h-80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center mb-4 text-gray-600">
                    <FaClock className="mr-2" />
                    <span>{post.date}</span>
                    <span className="mx-2">|</span>
                    <FaUser className="mr-2" />
                    <span>{post.author}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">
                    {post.heading}
                  </h3>
                  <p className="text-dark2 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <a href={`/blog/${post.id}`} className="text-primary flex items-center">
                  Read more <FaArrowRight className="ml-2" />
                </a>
              </motion.div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default BlogPost4;