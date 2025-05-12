/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { IoHeartOutline } from 'react-icons/io5';
import { cartActions } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { FaEye, FaExchangeAlt, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './NewProduct.css';

const ProductItem = ({ item, addToCart, addToFavourite }) => (
    <div className="items-product group relative">
      <div className="overflow-hidden">
        <img 
          src={item.images[0]} 
          alt={item.name} 
          className="itemsproduct-img h-44 object-contain transition-transform duration-200 transform group-hover:scale-110"
        />
      </div>
      <h2>{item.category}</h2>
      <h3>{item.name}</h3>
      <span className='flex items-center justify-center gap-10'>
      <h3 className="text-red-800 font-bold">{item.oldItemPrice}</h3>
        <strike>${item.newItemPrice}</strike>
      </span>
      <hr />
      <div className='bottom-icons flex justify-center items-center'>
        <button onClick={() => addToFavourite(item)} className='b-icons'>
          <IoHeartOutline />
          <span className='tooltipp'>ADD TO WISHLIST</span>
        </button>
        <button className='b-icons'>
          <FaExchangeAlt />
          <span className='tooltipp'>ADD TO COMPARE</span>
        </button>
        <button className='b-icons'>
            <FaEye />
            <span className='tooltipp'>QUICK VIEW</span>
        </button>
      </div>
      <div className="add-cart flex items-center justify-center">
        <button onClick={() => addToCart(item)} className='add-to-cart-btn flex'>
          <span className="mt-2 ml-5"><FaShoppingCart /></span>
          Add to cart
        </button>
      </div>
    </div>
);

function NewProduct() {
  const [sliderRef, setSliderRef] = useState(null);
  const dispatch = useDispatch();
  const [newProducts, setNewProducts] = useState([])

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const res = await axiosInstance.get('/products?isRecentlyAdded=true');
        setNewProducts(res.data.data.products);
      } catch (error) {
        console.error('Failed to fetch Products:', error);
      }
    };    
    fetchNewProducts();
  },[])

  const addToCart = (item) => {
    dispatch(cartActions.addItem({
      id: item._id,
      name: item.name,
      price: item.oldItemPrice,
      img: item.images[0],
      description: item.description,
    }));
    toast.success('Added Successfully');
  };

  const addToFavourite = (item) => {
    dispatch(cartActions.addToWishList({
      id: item.id,
      name: item.name,
      price: item.newItemPrice,
      oldPrice: item.oldItemPrice,
      img: item.images[0],
      description: item.description,
      category: item.category
    }));
    toast.success('Favourited!');
  };

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
    <div className="mt-10 mb-8 min-h-screen w-full">
      <div className="container mx-auto px-4">
        <div className="NewProduct flex flex-col justify-between md:flex-row">
          <div className="New-header mb-2 md:mb-0">
            <h1>NEW PRODUCTS</h1>
          </div>
          <div className="New-subheader">
            <div className="under-links">
              <ul className="flex flex-row gap-10 sm:justify-between">
                <li className="list">Laptops</li>
                <li className="list">Smartphones</li>
                <li className="list">Computers</li>
                <li className="list">TVs</li>
                <li className="list">Watch</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="items flex flex-col gap-4 mt-6">
          <div className='items-container'>
          <div className='items-slider'>
            <Slider ref={setSliderRef} {...settings}>
              {newProducts.map(item => (
                <ProductItem key={item._id} item={item} addToCart={addToCart} addToFavourite={addToFavourite} />
              ))}
            </Slider>
          </div>
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
  );
}

export default NewProduct;