/* eslint-disable */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Skeleton from '../../utils/Skeleton';
import pages from '../../utils/pages';
import './Search.css';

function Search() {
  const { query } = useParams();
  const [searchItems, setSearchItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/products');
        const allProductSearch = res.data.data.products;

        const currentSearch = allProductSearch.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        );

        setSearchItems(currentSearch);
        setLoading(false);
        console.log('Matched products:', currentSearch);
      } catch (error) {
        console.error('Search fetch error:', error);
      }
    };

    findProducts();
  }, [query]);

  return (
    <div>
      {loading ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : searchItems.length === 0 ? (
        <div className="w-100 h-100">
          <h1 className="text-center mt-4">Item Not Available</h1>
          <p className="text-center">Go to shop to see all available items</p>
          <Link to={pages.get('shop').path}>
            <button className="product-btn d-block m-auto my-3">Shop</button>
          </Link>
        </div>
      ) : (
        <div className="container mx-auto mb-8 mt-5">
          <h1 className="search-header p-2">Results for "{query}"</h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {searchItems.map((item) => (
              <div className="search group relative" key={item._id}>
                <div>
                  <img
                    src={`../${item.images?.[0]}`}
                    alt={item.name}
                    className="search-img h-full object-contain transition-transform duration-200 transform group-hover:scale-110"
                  />
                </div>
                <h2>{item.category}</h2>
                <h3>{item.name}</h3>
                <span className="flex items-center justify-center gap-10">
                  <h3 className="text-red-800 font-bold">${item.newItemPrice}</h3>
                  <strike>${item.oldItemPrice}</strike>
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
