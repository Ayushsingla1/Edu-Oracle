import RegisterButton from "../components/RegisterButton";
import PriceFeedGraph from "../components/Graph";
import AgentInfo from "../components/AgentInfo";
import React from 'react';
import { Bot, Award, CheckCircle, BarChart3, Wallet } from 'lucide-react';
import StakingControl from "../components/StatControl";
import StatCard from "../components/StatCard";
import { contractAddress , ABI } from "../config/contractInfo";
import { useAccount, useReadContract } from "wagmi";


const contractDetails = {
    address : contractAddress,
    abi : ABI
}

export default function Dashboard() {

    const {address} = useAccount();

    const {data, isSuccess , isLoading , isError } = useReadContract({
        ...contractDetails,
        account : address,
        functionName : "getAgentInfo",
    })

    const {data : data2 , isSuccess : isSuccess2 , isLoading : isLoading2 , isError : isError2} = useReadContract({
        ...contractDetails,
        functionName : "getPrice"
    })

    if(isLoading || isLoading2){
        console.log("liadindj")
        return <div className="w-screen h-screen flex justify-center items-center">Loading...</div>
    }

    if(isError2) {
        console.log(isError);
        return <div className="w-screen h-screen flex justify-center items-center">Error while loading</div>
    }
  
    if(isSuccess && isSuccess2){
        const stakedAmount = parseInt(data.stakedAmount)/(10 ** 18);
        const totalSubmissions = parseInt(data.totalSubmissions);
        const SuccessRate = parseInt(data.totalSubmissions) === 0 ? (0) : (parseInt(data.totalSubmissions - data.penaltyCount)/(parseInt(data.totalSubmissions)) * 100) ;
        const isRegistered = data.isRegistered;
        const LastPrice = (parseInt(data2)/(10 ** 18)).toFixed(3);

        return (
        
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Bot className="text-emerald-400" />
                  AI Price Feed Dashboard
                </h1>
                {isRegistered ? (
                  <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-700/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-sm font-medium">Agent Active</span>
                  </div>
                ) : (
                  <RegisterButton />
                )}
              </div>
        
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={Award}
                  title="Last Price Update"
                  value={`$${LastPrice}`}
                />
                <StatCard
                  icon={Wallet}
                  title="Total Updates"
                  value={totalSubmissions}
                />
                <StatCard
                  icon={CheckCircle}
                  title="Amount Staked"
                  value={stakedAmount}
                />
                <StatCard
                  icon={BarChart3}
                  title="Accuracy Rate"
                  value={SuccessRate}
                />
              </div>
        
              {/* Price Feed Graph */}
              <div className="mb-8">
                <PriceFeedGraph />
              </div>
        
              {/* Interactive Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StakingControl />
                <AgentInfo />
              </div>
            </div>
          );
    }
  }