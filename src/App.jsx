import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Blog from "./components/Blog/Blog";
import BlogPost1 from "./components/Blog/BlogPost1";
import BlogPost2 from "./components/Blog/BlogPost2";
import BlogPost3 from "./components/Blog/BlogPost3";
import BlogPost4 from "./components/Blog/BlogPost4";
import BlogPost5 from "./components/Blog/BlogPost5";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Banner2 from "./components/Banner/Banner2";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import AboutUs from "./components/AboutUs/AboutUs";
import Whoweare from "./components/AboutUs/Whoweare";
import OurServices from "./components/OurServices/OurServices";
import StudyMaterials from "./components/StudyMaterials/StudyMaterials";
import LatestNews from "./components/Blog/LatestNews";


const App = () => {
  return (
    <Router>
      <main className="overflow-x-hidden bg-white text-dark">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Services />
              <Banner />
              <Subscribe />
              <Whoweare />
              <Banner2 />
              <Blog />
            </>
          } />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/our-services" element={<OurServices />} />
          <Route path="/study-materials" element={<StudyMaterials />} />
          <Route path="/latest-news" element={<LatestNews />} />
          <Route path="/blog/1" element={<BlogPost1 />} /> {/* Add route for the new blog post */}
          <Route path="/blog/2" element={<BlogPost2 />} /> {/* Add route for the new blog post */}
          <Route path="/blog/3" element={<BlogPost3 />} /> {/* Add route for the new blog post */}
          <Route path="/blog/4" element={<BlogPost4 />} /> {/* Add route for the new blog post */}
          <Route path="/blog/5" element={<BlogPost5 />} /> {/* Add route for the new blog post */}
        </Routes>
        <Footer />
      </main>
    </Router>
  );
};

export default App;