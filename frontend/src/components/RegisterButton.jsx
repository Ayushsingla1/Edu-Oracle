import React from 'react';
import { Bot } from 'lucide-react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { ABI, contractAddress } from '../config/contractInfo';

function RegisterButton() {

     const {writeContract , data : hash , isPending , error} = useWriteContract()
     const { isLoading , isError , isSuccess } = useWaitForTransactionReceipt({hash});

    const handleRegister = (e) => {
        e.preventDefault();
        writeContract({
            abi : ABI,
            address : contractAddress,
            functionName : "registerAsAgent",
            value : 1000000000000000n
        })
    };


    if(isError && !isPending) {
        console.log(error)
        return <div>error while processing payment</div>
    }
    if(isSuccess && isPending){
        console.log(hash);
    }
    
    if(isLoading) {
        return <div>payment processing</div>
    }

    if(!isPending){
        return (
            <button
              onClick={handleRegister}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
            >
              <Bot className="w-5 h-5" />
              Register New Agent
            </button>
          );
    }
}
  

export default RegisterButton;