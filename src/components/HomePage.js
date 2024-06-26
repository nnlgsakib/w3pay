// src/components/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const product = {
    name: 'Random Product',
    price: 0.1 // 5 ETH
  };

  const handleBuyNow = () => {
    navigate('/pay', { state: { product } });
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: {product.price} ETH</p>
      <button onClick={handleBuyNow}>Buy Now</button>
    </div>
  );
};

export default HomePage;