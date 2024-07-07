import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { product } from '../../data';
import pages from '../../utils/pages';
import { cartActions } from '../../redux/cartSlice';
import { RiStarFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ItemDetails.css';

function ItemDetails() {
  const { id } = useParams();
  const ref = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reviewUser = useRef('');
  const reviewMsg = useRef('');

  const [activeTab, setActiveTab] = useState('description');
  const [rating, setRating] = useState(null);

  const item = product.find((item) => item.id === id);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewUserName = reviewUser.current.value;
    const reviewUserMsg = reviewMsg.current.value;
    const review = {
      author: reviewUserName,
      message: reviewUserMsg,
      rating,
    };

    console.log(review);
    toast.info('Thank you for reviewing this product');

    // Clear out the inputs
    reviewUser.current.value = '';
    reviewMsg.current.value = '';
    setRating(null);
  };

  const addToCart = () => {
    dispatch(cartActions.addItem({
      id: id,
      name: item.itemInfo.name,
      price: item.itemInfo.newItemPrice,
      img: item.itemInfo.itemImg[0],
      description: item.itemInfo.description,
    }));
    toast.success('Added Succesfully');
  };

    const buyNow = () => {
    const totalAmount = item.itemInfo.newItemPrice;
    const totalQuantity = 1;
    const discount = 5; // $5 off per item
    const totalCost = totalAmount - discount;

    navigate(pages.get('checkout').path, {
      state: {
        totalQuantity,
        totalAmount,
        totalCost
      }
    });
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [id]);

  if (!item) {
    return <p>Product not found</p>;
  }

  const { itemInfo } = item;

  const handleRating = (rate) => {
    setRating(rate);
  };

  const filteredProducts = product.filter((prod) => prod.itemInfo.category === itemInfo.category && prod.id !== item.id);

  return (
    <div ref={ref} className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-5 md:gap-20 pb-8 min-h-full">
        <div className="w-full md:w-1/4 flex justify-center items-center">
          <figure className='details-cover relative w-88'>
            <img className='itemDetails-img object-contain mt-8' src={`../${itemInfo.itemImg[0]}`} alt={itemInfo.name} />
          </figure>
        </div>

        <div className="second-details items-center justify-center w-full md:w-3/4 mt-8 md:mt-20 text-center md:text-left">
          <h3 className="font-bold text-lg">{itemInfo.category}</h3>
          <h1 className='mt-3 text-2xl'>{itemInfo.name}</h1>
          <h1>${itemInfo.newItemPrice}</h1>
          <p className="mt-2">{itemInfo.shortDesc}</p>

          <div className='flex flex-col md:flex-row gap-3 mt-5'>
            <button className='product-btn' onClick={addToCart}>Add to cart</button>
            <button type='button' className="buy-btn" onClick={buyNow}>Buy Now</button>
          </div>
        </div>
      </div>

      <div className='last-details mt-5 mb-8'>
        <div className='flex justify-center md:justify-start gap-11 mb-5'>
          <h2
            className={`cursor-pointer text-lg transition-colors duration-300 ${activeTab === 'description' ? 'text-red-700' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </h2>
          <h2
            className={`cursor-pointer text-lg transition-colors duration-300 ${activeTab === 'review' ? 'text-red-700' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            Review({itemInfo.reviews.length})
          </h2>
        </div>
        <div className={`transition-opacity duration-300 ${activeTab === 'description' ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <p>{itemInfo.description}</p>
        </div>
        <div className={`transition-opacity duration-300 ${activeTab === 'review' ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <ul>
            {itemInfo.reviews.map((review, index) => (
              <li key={index}>
                <p className='mt-4'>Jane Doe</p>
                <p>{review.text}</p>
                <span className='text-orange-600'>{review.rating} stars</span>
              </li>
            ))}
            <div className='reviews flex flex-col'>
              <h1 className='mt-8'>Tell us about your experience</h1>
              <input className='w-80 md:w-full border-black p-4' 
              type='text' 
              placeholder='Enter name'
              ref={reviewUser}
              required />

              <div className='flex gap-5 py-3'>
                {[1, 2, 3, 4, 5].map((rate) => (
                  <span key={rate} title='rate' onClick={() => handleRating(rate)} className={`cursor-pointer ${rate <= rating ? 'text-orange-800' : 'text-gray-400'}`}>
                    {rate}<RiStarFill />
                  </span>
                ))}
              </div>
              <textarea className='mt-3 w-80 md:w-full' rows={'4'}
              type='text'
              placeholder='Review message'
              ref={reviewMsg}
              required />

              <button type='button' className='reviews-button self-start mt-4' onClick={handleSubmit}>Submit</button>
            </div>
          </ul>
        </div>
      </div>

      <div className='mt-5'>
        <h1 className="related-title mb-4">You might also like</h1>
        <div className="Recommended-product">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-8 mb-8">
            {filteredProducts.map((relatedItem) => (
              <Link 
                key={relatedItem.id} 
                to={`/products/${relatedItem.id}`}
                onClick={() => {
                  if (ref.current) {
                    ref.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <div className="recommended-product group relative">
                  <div className="overflow-hidden">
                    <img
                      src={`../${relatedItem.itemInfo.itemImg[0]}`}
                      alt={relatedItem.itemInfo.name}
                      className="recommended-img h-80 object-contain items-center justify-center transition-transform duration-200 transform group-hover:scale-110"
                    />
                  </div>
                  <h2>{relatedItem.itemInfo.category}</h2>
                  <h3>{relatedItem.itemInfo.name}</h3>
                  <span className='flex items-center justify-center gap-10'>
                    <h3 className="text-red-800 font-bold">${relatedItem.itemInfo.newItemPrice}</h3>
                    <strike>{relatedItem.itemInfo.oldItemPrice}</strike>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;
