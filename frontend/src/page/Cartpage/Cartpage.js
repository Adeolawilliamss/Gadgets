/*eslint-disable*/
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from './../context/AuthContext';
import { cartActions } from '../../redux/cartSlice';
import pages from '../../utils/pages';
import { FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './Cartpage.css';

function Cartpage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const carts = useSelector((state) => state.cart.cartItem);
  const { totalAmount, totalQuantity } = useSelector((state) => state.cart);
  const discount = 5;
  const totalCost = totalAmount - totalQuantity * discount;
  const totalDiscount = totalQuantity * discount;

  const removeProduct = (id) => {
    dispatch(cartActions.clearCart());
  };

  const handleCheckout = () => {
    navigate(pages.get('checkout').path, {
      state: {
        totalQuantity,
        totalAmount,
        totalCost,
        totalDiscount,
      },
    });
  };

  return (
    <div className="w-full bg-slate-100 h-full">
      <div className="container mx-auto px-4">
        <div className="cart">
          <div className="video-container">
            <video
              className="cart__video"
              autoPlay={true}
              loop
              muted
              controls=""
              preload="auto"
            >
              <source src="./assets/video/smartphone.mp4" type="video/mp4" />
            </video>
            <div className="video-overlay"></div>
            <h3>Your Cart Items</h3>
          </div>

          {carts.length === 0 ? (
            <h1 className="text-center mt-5">NO PRODUCT FOUND</h1>
          ) : (
            <div className="form__group flex flex-col md:flex-row mt-5 mb-8">
              <div className="cart-content overflow-x-auto">
                <table className="table-auto border-b-2 w-full">
                  <thead className="t-head border-b-2 border-black">
                    <tr>
                      <th className="p-2">Image</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Price</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carts.map((item, index) => (
                      <tr key={index} className="tr">
                        <td className="p-2">
                          <Link to={`/products/${item.id}`}>
                            <img
                              src={`../${item.img}`}
                              alt=""
                              className="cart-img"
                            />
                          </Link>
                        </td>
                        <td className="p-2 text-xl">{item.name}</td>
                        <td className="p-2 text-xl">${item.price}</td>
                        <td className="p-2 text-xl">{item.quantity}</td>
                        <td className="p-2 text-xl">
                          <span
                            onClick={() =>
                              dispatch(cartActions.removeFromCart(item.id))
                            }
                          >
                            <FaTrash />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={removeProduct} className="product-btn">
                  Clear All
                </button>
              </div>

              <div className="checkout__cart">
                <h4>
                  TotalQty: <span>{totalQuantity}</span>
                </h4>
                <h4>
                  Subtotal: <span>${totalAmount}</span>
                </h4>
                <div className="flex">
                  <span>Discount: </span>
                  <span className="checkout-discount">${totalDiscount}</span>
                </div>
                <hr />
                <h4 className="total">
                  Total cost: <span>${totalCost}</span>
                </h4>
                <button
                  type="button"
                  className="checkout-btn relative overflow-hidden group"
                  onClick={handleCheckout}
                >
                  <span className="block w-full text-white">
                    {isAuthenticated ? 'Checkout' : 'Login to continue'}
                  </span>
                  <span className="absolute inset-0 bg-black text-white flex items-center justify-center translate-x-full group-hover:translate-x-0 transition-transform duration-300">
                    {isAuthenticated ? 'Checkout' : 'Login to continue'}
                  </span>
                </button>

                <Link to={'/'}>
                  <button className="place__order w-full">
                    <p>Continue Shopping</p>
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cartpage;
