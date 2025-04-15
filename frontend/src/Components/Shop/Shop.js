/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Skeleton from '../../utils/Skeleton';
import './Shop.css';

const ProductItem = ({ item }) => (
  <Link to={`/products/${item._id}`}>
    <div className="shop-product group relative">
      <div className="overflow-hidden">
        <img
          src={`../${item.images[0]}`}
          alt={item.name}
          loading="lazy"
          className="shop-img h-full object-contain transition-transform duration-200 transform group-hover:scale-110"
        />
      </div>
      <h2>{item.category}</h2>
      <h3>{item.name}</h3>
      <span className="flex items-center justify-center gap-10">
        <h3 className="text-red-800 font-bold">${item.oldItemPrice}</h3>
        <strike>${item.newItemPrice}</strike>
      </span>
    </div>
  </Link>
);

function Shop() {
  const { category } = useParams();
  const [shop, setShop] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/products?fields=_id,images,name,collection,oldItemPrice,newItemPrice,category'
        );
        setShop(res.data.data.products);
      } catch (error) {
        console.log('Error fetching data:', error);
      } finally {
        setLoading(false); // ✅ Set loading to false when done
      }
    };

    setLoading(true); // Reset loading before fetching again
    fetchShopData();
  }, [category]);

  const filteredProducts =
    category === 'all'
      ? shop
      : shop.filter(
          (item) =>
            item.category?.toLowerCase() === category?.toLowerCase()
        );

  return (
    <div className="shop">
      <h1 className="shop-header mt-5">Products Available for {category}</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8 mb-4">
        {loading ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : filteredProducts.length === 0 ? (
          <p>No products found for this category.</p>
        ) : (
          filteredProducts.map((item) => (
            <ProductItem key={item._id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

export default Shop;
