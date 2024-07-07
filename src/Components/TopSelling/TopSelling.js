import React, { useState } from 'react';
import {FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { weeklyFeatures } from '../../data';
import './TopSelling.css';

const ProductItem = ({ itemInfo }) => (
    <div className="topselling-product group relative">
      <div className="overflow-hidden">
      <img 
        src={itemInfo.itemImg[0]} 
        alt={itemInfo.name} 
        className="w-full h-44 object-contain transition-transform duration-200 transform group-hover:scale-110"
      />
    </div>
      <h2>{itemInfo.category}</h2>
      <h3>{itemInfo.name}</h3>
      <span className='flex items-center justify-center gap-10'>
                  <h3 className="text-red-800 font-bold">${itemInfo.newItemPrice}</h3>
                  <strike>{itemInfo.oldItemPrice}</strike>
                  </span>
     </div>
  );

function TopSelling () {

  const [sliderRef, setSliderRef] = useState(null);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
    return (
        <div className="border-b-4 min-h-screen w-full">
            <div className="container mx-auto px-4">
          <div className="New-header mt-4 md:mb-0">
            <h1>TOP SELLING</h1>
          </div>
          <div className="top-selling flex flex-col gap-4 mt-6">
          <div className='my-slider'>
          <Slider ref={setSliderRef} {...settings}>
              {weeklyFeatures.map(item => (
                <ProductItem key={item.id} itemInfo={item.itemInfo} />
              ))}
            </Slider>
          </div>
          <div className='controls flex justify-center mt-4'>
            <button onClick={() => sliderRef?.slickPrev()} className='control-button'>
              <FaChevronLeft />
            </button>
            <button onClick={() => sliderRef?.slickNext()} className='control-button'>
              <FaChevronRight />
            </button>
          </div>
          </div>
          </div>
            </div>
    )
}

export default TopSelling;