import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../../redux/cartSlice';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pages from "../../utils/pages";
import './Favourite.css';

function Favourite() {
  const dispatch = useDispatch();
  const wishList = useSelector((state) => state.cart.favItem);
  const { wishListQuantity } = useSelector((state) => state.cart);

  const addToCart = (item) => {
    dispatch(cartActions.addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.img,
      description: item.description,
    }));
    dispatch(cartActions.removeFromWishList(item.id));
  };

  const removeFromWishlist = (item) => {
    dispatch(cartActions.removeFromWishList(item.id));
    toast.success('Removed from Wishlist');
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mt-5 bg-slate-100 mb-5 p-5">
        {wishList.length > 0 && (
          <h1 className='mb-4 px-3'>You have {wishList.length} item(s) in your wishList</h1>
        )}
        {wishList.length === 0 ? (
          <div>
            <h1 className='text-center'>Start shopping to create a wishlist</h1>
            <Link to={pages.get('shop').path}>
              <button className="product-btn item-center text-center mt-3">Shop here</button>
            </Link>
          </div>
        ) : (
          <>
            <div className="favourite-items grid grid-cols-1 md:grid-cols-3 gap-4">
              {wishList.map((item) => (
                <div key={item.id} className="favourite-item text-center justify-items-center bg-white p-4 rounded shadow">
                  <img src={item.img} alt={item.name} className="favourite-img mb-3 h-88 object-contain transition-transform duration-200 transform group-hover:scale-110" />
                  <h2 className="text-3xl text-bold">{item.name}</h2>
                  <p className="text-xl">Price: ${item.price}</p>
                  <div className="add-cart flex gap-5 items-center justify-center mt-5">
                    <button onClick={() => addToCart(item)} className='add-to-cart-btn flex'>
                      <span className="mt-2 ml-5"><FaShoppingCart /></span>
                      Add to cart
                    </button>
                  </div>
                  <div className="flex mt-3">
                    <button onClick={() => removeFromWishlist(item)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <h2>Total Quantity: <span className="text-2xl">{wishListQuantity}</span></h2>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Favourite;