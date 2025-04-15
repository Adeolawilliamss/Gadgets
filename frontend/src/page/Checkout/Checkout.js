/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import pages from "../../utils/pages";
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Checkout.css';
import LoadingSpinner from "../../utils/LoadingSpinner/LoadingSpinner";
import '../../utils/LoadingSpinner/Spinner.css';

function Checkout() {
  const navigate = useNavigate(); 
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { totalQuantity, totalAmount, totalCost, totalDiscount } = location.state || {};
  const discount = 5;
  const carts = useSelector((state) => state.cart.cartItem);


  const [input, setInput] = useState({
    name: '',
    email: '',
    number: '',
    postalCode: '',
    address: '',
    city: '',
  });

  const [emailError, setEmailError] = useState('');
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(value) ? '' : 'Invalid email format');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      console.log('Loading complete');
    }, 3000);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <LoadingSpinner />
      </div>
    );
  }


  const handlePlaceOrder = () => {
          if (!isFormValid()) {
           setFormError('All inputs must be filled correctly.');
           return;
         }
    const orderData = {
      billingDetails: input,
      shoppingDetails: carts,
      totalQuantity,
      totalAmount,
      totalCost,
      totalDiscount,
      deliveryFee: 10 // Assuming a fixed delivery fee
    };
    
    navigate(pages.get('finalorder').path, { state: orderData });
  };

  const isFormValid = () => {
    return (
      input.name &&
      input.email &&
      input.number &&
      input.address &&
      input.postalCode &&
      input.city &&
      !emailError
    );
  };

  return (
    <div className="mt-10 mb-8 min-h-screen w-full">
      <div className="container bg-slate-100 mx-auto px-4">
        <div className='billing-group flex flex-col gap-40 md:flex-row mt-5 mb-8'>
          <div className="billing-form">
            <h1 className="mb-8">Billing Information</h1>
            <form className='checkout-form'>
              <input
                type='text'
                name='name'
                value={input.name}
                placeholder='Enter your Name'
                onChange={handleChange}
                required
              />
              <input
                type='email'
                name='email'
                value={input.email}
                placeholder='Enter your Email'
                onChange={handleChange}
                required
              />
              {emailError && <p className="error-message">{emailError}</p>}
              <input
                type='number'
                name='number'
                value={input.number}
                placeholder='Enter your Number'
                onChange={handleChange}
                required
              />
              <input
                type='text'
                name='address'
                value={input.address}
                placeholder='Street Address'
                onChange={handleChange}
                required
              />
              <input
                type='text'
                name='postalCode'
                value={input.postalCode}
                placeholder='Postal Code'
                onChange={handleChange}
                required
              />
              <input
                type='text'
                name='city'
                value={input.city}
                placeholder='City'
                onChange={handleChange}
                required
              />
            </form>
              {!isFormValid() && (
              <p className="error-message">All inputs must be filled correctly.</p>
            )}
          </div>
          {totalQuantity && totalAmount && totalCost ? (
            <div className='billing-checkout'>
              <h4>TotalQty: <span>{totalQuantity}</span></h4>
              <h4>Subtotal:  <span>${totalAmount}</span></h4>
              <h4>Discount:  <span>${totalDiscount}</span></h4>
              <hr />
              <h4 className='total'>Total: <span>${totalCost}</span></h4>
              <button
                className="place__order"
                onClick={handlePlaceOrder}
                disabled={!isFormValid()}
              >
                <p>Place an order</p>
              </button>
            </div>
          ) : (
            <p className="mt-8 text-center">No items to checkout.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;


