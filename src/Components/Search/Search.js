import React from "react";
import { product } from '../../data';  // Correct import here
import { useParams, Link } from 'react-router-dom';
import pages from "../../utils/pages";
import './Search.css';

function Search() {
  const { query } = useParams();
  
  // Filter products based on search query
  const searchItems = product.filter((item) =>
    item.itemInfo.name.toLowerCase().includes(query.toLowerCase()) ||
    item.itemInfo.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      {searchItems.length === 0 ? (
        <>
          <h1 className='text-center mt-4'>Item Not Available</h1>
          <p className='text-center'>Go to shop to see all available items</p>
          <Link to={pages.get('shop').path}>
            <button className="product-btn d-block m-auto my-3"> Shop</button>
          </Link>
        </>
      ) : (
        <div className="container bg-slate-100 mx-auto">
          <h1 className='search-header p-2'>Results for {query}</h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {searchItems.map((item) => (
              <div className="search group relative" key={item.id}>
                <div>
                  <img
                    src={`../${item.itemInfo.itemImg[0]}`}
                    alt={item.itemInfo.name}
                    className="search-img h-full object-contain transition-transform duration-200 transform group-hover:scale-110"
                  />
                </div>
                <h2>{item.itemInfo.category}</h2>
                <h3>{item.itemInfo.name}</h3>
                <span className='flex items-center justify-center gap-10'>
                  <h3 className="text-red-800 font-bold">${item.itemInfo.newItemPrice}</h3>
                  <strike>{item.itemInfo.oldItemPrice}</strike>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
