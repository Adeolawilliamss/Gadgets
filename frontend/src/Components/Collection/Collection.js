/*eslint-disable*/
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { FaArrowCircleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Collection.css';

function Collection() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get('/store');
        setCollections(res.data.data.store); // matches your controller's response
      } catch (err) {
        console.error("Failed to fetch collections:", err);
      }
    };
    fetchCollections();
  }, []);

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="collection">
          <div className="under-links py-8 border-b-4">
            <ul className="gap-4 items-center justify-center mt-8 hidden md:flex">
              <li className="list"><Link to="#collection">Home</Link></li>
              <li className="list"><Link to="#newProduct">New Products</Link></li>
              <li className="list"><Link to="#topSelling">Trending Products</Link></li>
              <li className="list"><Link to="#newsletter">NewsLetter</Link></li>
            </ul>
          </div>
          <div className="collection-page grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((item) => (
              <div key={item._id}>
               <Link to={`/shop/${item.collection.toLowerCase()}`}>
                  <div className="second-collection">
                    <div className="collection-video">
                      {item.video ? (
                        <video src={item.video} autoPlay loop muted playsInline className="w-full h-auto"></video>
                      ) : (
                        <p>No Video Available</p>
                      )}
                    </div>

                    <div className="collection-body">
                      <h3>{item.collection} Collection</h3>
                      <button className="cta-btn">
                        Shop now <span className="arrow"><FaArrowCircleRight /></span>
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collection;