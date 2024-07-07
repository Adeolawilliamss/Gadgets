import React, { useState } from "react";
import { FaArrowCircleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { product } from '../../data';
import './Collection.css';

function Collection() {
  const [filter, setFilter] = useState(product);

  const uniqueObjects = filter.reduce((item, cat) => {
    Object.assign(item, { [cat.itemInfo.category]: cat });
    return item;
  }, {});

  const unique = Object.values(uniqueObjects);
  console.log(unique);

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="collection">
          <div className="under-links py-8 border-b-4">
            <ul className="flex gap-4 items-center justify-center mt-8 hidden md:flex">
              <li className="list"><Link to="#collection">Home</Link></li>
              <li className="list"><Link to="#newProduct">New Products</Link></li>
              <li className="list"><Link to="#topSelling">Trending Products</Link></li>
              <li className="list"><Link to="#newsletter">NewsLetter</Link></li>
            </ul>
          </div>
          <div className="collection-page grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {unique.map((item) => {
              const { id, itemInfo } = item;
              return (
                <div key={id}>
                  <Link to={`/shop/${itemInfo.category}`}>
                    <div className="second-collection">
                      <div className="collection-img">
                        <img src={itemInfo.itemImg[0]} alt="" />
                      </div>
                      <div className="collection-body">
                        <h3>{itemInfo.category} collection</h3>
                        <button className="cta-btn">Shop now <span className="arrow"><FaArrowCircleRight /></span></button>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collection;