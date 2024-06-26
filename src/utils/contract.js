// src/utils/contract.js
import { ethers } from 'ethers';
import { ABI } from './abi';

const contractAddress = '0xee52FDbccF11eC1E28a67015fA90A5CC3e46c358';
const contractAbi = ABI

export const getContract = (signer) => {
    return new ethers.Contract(contractAddress, contractAbi, signer);
  };
  
  export const getProofFromLogs = (logs) => {
    for (let log of logs) {
      try {
        const parsedLog = new ethers.utils.Interface(contractAbi).parseLog(log);
        if (parsedLog.name === 'PaymentMade') {
          return parsedLog.args.proof;
        }
      } catch (error) {
        console.error('Failed to parse log:', error);
      }
    }
    return null;
  };
