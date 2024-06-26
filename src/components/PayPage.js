// src/components/PayPage.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { getContract, getProofFromLogs } from '../utils/contract';

/**
 * PayPage component for handling payment process with MetaMask
 * Organization: nlg
 */
const PayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || { product: { name: 'N/A', price: 0 } };
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [signature, setSignature] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(newProvider);
    } else {
      alert('Please install MetaMask!');
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (provider) {
        await provider.send('eth_requestAccounts', []);
        const newSigner = provider.getSigner();
        const address = await newSigner.getAddress();
        setSigner(newSigner);
        setAccount(address);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. See console for details.');
    }
  };

  const signPayment = async () => {
    try {
      const message = JSON.stringify({
        timestamp: Date.now(),
        address: account,
        amount: product.price
      });

      const signature = await signer.signMessage(message);
      setSignature(signature);
      console.log('Signature:', signature);
    } catch (error) {
      console.error('Failed to sign payment:', error);
      alert('Failed to sign payment. See console for details.');
    }
  };

  const confirmPayment = async () => {
    try {
      if (!signature) {
        alert('Please sign the payment first.');
        return;
      }
      const payorg = 'w320'
      const contract = getContract(signer);
      const amountInEther = product.price.toString();
      console.log(`Sending payment of ${amountInEther} ETH to the contract`);

      const tx = await contract.pay(payorg, { value: ethers.utils.parseEther(amountInEther) });
      console.log('Transaction:', tx);

      const receipt = await tx.wait();
      console.log('Transaction Receipt:', receipt);

      const proof = getProofFromLogs(receipt.logs);
      console.log('Payment proof:', proof);

      alert('Payment confirmed!');
      navigate('/');
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      alert('Failed to confirm payment. See console for details.');
    }
  };

  return (
    <div>
      <h1>Pay for {product.name}</h1>
      <p>Price: {product.price} ETH</p>
      {!account ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <>
          <button onClick={signPayment}>Sign Payment</button>
          {signature && <button onClick={confirmPayment}>Confirm Payment</button>}
        </>
      )}
    </div>
  );
};

export default PayPage;
