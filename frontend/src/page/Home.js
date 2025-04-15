/*eslint-disable*/
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Collection from './../Components/Collection/Collection';
import NewProduct from './../Components/NewProduct/NewProduct';
import Icons from './../Components/Icons/Icons';
import TopSelling from './../Components/TopSelling/TopSelling';
import Newsletter from './../Components/Newsletter/Newsletter';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const collectionRef = useRef(null);
  const newProductRef = useRef(null);
  const iconsRef = useRef(null);
  const topSellingRef = useRef(null);
  const newsletterRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div>
      <motion.div id="collection" initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
        <Collection ref={collectionRef} />
      </motion.div>
      <motion.div id="newProduct" initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.4 }}>
        <NewProduct ref={newProductRef} />
      </motion.div>
      <motion.div id="icons" initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.6 }}>
        <Icons ref={iconsRef} />
      </motion.div>
      <motion.div id="topSelling" initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5, delay: 0.8 }}>
        <TopSelling ref={topSellingRef} />
      </motion.div>
      <motion.div id="newsletter" initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5, delay: 1 }}>
        <Newsletter ref={newsletterRef} />
      </motion.div>
    </div>
  );
};

export default Home;