import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { ABI, contractAddress } from '../config/contractInfo';
import { parseEther } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-toastify';

function StakingControl() {
    const [amount, setAmount] = useState('');
    const [isStaking, setIsStaking] = useState(true);

    const {writeContract , data : hash , isPending , error} = useWriteContract()
    const { isSuccess } = useWaitForTransactionReceipt({hash});
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const val = String(amount)
      if(isStaking){
        writeContract({
          abi : ABI,
          address : contractAddress,
          functionName : "stakeMore",
          value : parseEther(val),
          args : [parseEther(val)]
        })
      }
      else{
        writeContract({
          abi : ABI,
          address : contractAddress,
          functionName : "unstake",
          args : [parseEther(val)]
        })
      }
      setAmount('');
    };

    // if(isPending){
    //   return <div>processing...</div>
    // }

    // else if(isError){

    // }

    if(isSuccess){
      toast.success(`Amount ${ isStaking ? ("Staked") : ("Unstaked")} Succesfully`);
    }


      return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setIsStaking(true)}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                isStaking 
                  ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <ArrowUpCircle className="w-5 h-5" />
              Acquire Agent
            </button>
            <button
              onClick={() => setIsStaking(false)}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                !isStaking 
                  ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <ArrowDownCircle className="w-5 h-5" />
              Release Agent
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                Stake Amount (ETH)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  step="0.001"
                  min="0"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/20 transition-all"
                />
                <span className="absolute right-3 top-3 text-gray-400">ETH</span>
              </div>
            </div>
            {
              isPending ? (<div className=" text-center w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-xl transition-colors">processing</div>) : (<button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                {isStaking ? 'Acquire AI Agent' : 'Release AI Agent'}
              </button>) 
            }
          </form>
        </div>
      );
    }
  
export default StakingControl;