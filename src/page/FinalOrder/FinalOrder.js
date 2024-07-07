import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { cartActions } from '../../redux/cartSlice';
import './FinalOrder.css';
import LoadingSpinner from "../../utils/LoadingSpinner/LoadingSpinner";
import '../../utils/LoadingSpinner/Spinner.css';

function FinalOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { billingDetails, shoppingDetails, totalQuantity, totalAmount, totalCost, deliveryFee } = location.state || {};

  const handleContinue = (id) => {
    dispatch(cartActions.clearCart());
    navigate('/');
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      console.log('Loading complete');
    }, 4000);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mt-10 mb-8 min-h-screen w-full">
      <div className="container mx-auto px-4">
        <h1 className="FinalOrder text-center text-2xl">Thanks for Ordering! &#128525;</h1>

        <div className="First-final mb-6">
          <h1>Billing Details</h1>
          <p className="text-lg mb-2">Name: {billingDetails?.name}</p>
          <p className="text-lg mb-2">Email: {billingDetails?.email}</p>
          <p className="text-lg mb-2">Number: {billingDetails?.number}</p>
          <p className="text-lg mb-2">Address: {billingDetails?.address}</p>
          <p className="text-lg mb-2">City: {billingDetails?.city}</p>
          <p className="text-lg mb-2">Postal Code: {billingDetails?.postalCode}</p>
        </div>
        <div className="First-final">
          <h1>Shopping Details</h1>
          {shoppingDetails?.map((item, index) => (
            <div key={index} className="final-details bg-slate-200 font-extrabold flex justify-between">
              <div>{item.quantity}X</div>
              <div><img src={`../${item.img}`} alt={item.name} className="w-20 h-20 object-contain" /></div>
              <div>{item.name}</div>
            </div>
          ))}
        </div>

        <div className="second-final flex justify-between mt-2 mb-2">
          <h2>Total Order(s)</h2>
          <h3 className="text-xl font-bold">{totalQuantity}</h3>
        </div>

        <div className="second-final flex justify-between mt-2 mb-2">
          <h2>SubTotal</h2>
          <h3 className="text-xl font-bold">${totalAmount}</h3>
        </div>

        <div className="second-final flex justify-between mt-2 mb-2">
          <h2>Delivery Fee</h2>
          <h3 className="text-xl font-bold">${deliveryFee}</h3>
        </div>

        <div className="second-final flex justify-between mt-2 mb-5">
          <h1>TOTAL</h1>
          <h2 className="text-2xl font-extrabold">${totalCost + deliveryFee}</h2>
        </div>

        <div className='modal__btn pb-3'>
          <button onClick={() => navigate(-1)}><FaArrowLeft/>Back</button>
          <button onClick={handleContinue} className='continue'>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default FinalOrder;

