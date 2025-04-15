/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './TopSelling.css';

const ProductItem = ({ item }) => (
    <div className="topselling-product group relative">
      <div className="overflow-hidden">
      <img 
        src={item.images[0]} 
        alt={item.name} 
        className="w-full h-44 object-contain transition-transform duration-200 transform group-hover:scale-110"
      />
    </div>
      <h2>{item.category}</h2>
      <h3>{item.name}</h3>
      <span className='flex items-center justify-center gap-10'>
      <h3 className="text-red-800 font-bold">{item.oldItemPrice}</h3>
          <strike>${item.newItemPrice}</strike>
       </span>
     </div>
  );

function TopSelling () {

  const [sliderRef, setSliderRef] = useState(null);
  const [weeklyFeatures,setWeeklyFeatures] = useState([])

  useEffect(() => {
    const fetchWeeklyFeatures = async () => {
      try {
        const res = await axios.get('/products?feature=weekly');
        console.log(res.data)
        setWeeklyFeatures(res.data.data.products);
      } catch (error) {
        console.error('Failed to fetch Products:', error);
      }
    };    
    fetchWeeklyFeatures();
  },[])

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
                <ProductItem key={item._id} item={item} />
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