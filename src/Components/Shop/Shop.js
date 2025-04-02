import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { product } from '../../data';
import './Shop.css';

const ProductItem = ({ item }) => (
  <Link to={`/products/${item.id}`}>
    <div className="shop-product group relative">
      <div className="overflow-hidden">
        <img
          src={`../${item.itemInfo.itemImg[0]}`}
          alt={item.itemInfo.name}
          className="shop-img h-full object-contain transition-transform duration-200 transform group-hover:scale-110"
        />
      </div>
      <h2>{item.itemInfo.category}</h2>
      <h3>{item.itemInfo.name}</h3>
      <span className='flex items-center justify-center gap-10'>
        <h3 className="text-red-800 font-bold">${item.itemInfo.newItemPrice}</h3>
        <strike>{item.itemInfo.oldItemPrice}</strike>
      </span>
    </div>
  </Link>
);

function Shop() {
  const { category } = useParams();

  // const filteredProducts = product.filter((item) => item.itemInfo.category === category);
  const filteredProducts = category === 'all' 
  ? product 
  : product.filter((item) => item.itemInfo.category.toLowerCase() === category.toLowerCase());

  return (
    <div className='shop'>
      <h1 className='shop-header mt-5'>Products Available for {category}</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8 mb-4">
        {filteredProducts.map(item => (
          <ProductItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Shop;