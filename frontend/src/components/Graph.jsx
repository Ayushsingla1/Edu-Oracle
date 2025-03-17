import React from 'react';
import { BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useReadContract } from 'wagmi';
import { ABI, contractAddress } from '../config/contractInfo';


const priceData = [
    { timestamp: '09:00', price: 1832.45 },
    { timestamp: '09:15', price: 1835.20 },
    { timestamp: '09:30', price: 1838.15 },
    { timestamp: '09:45', price: 1836.80 },
    { timestamp: '10:00', price: 1840.25 },
    { timestamp: '10:15', price: 1842.65 },
    { timestamp: '10:30', price: 1841.90 },
    { timestamp: '10:45', price: 1843.55 },
];

function PriceFeedGraph() {

  const {data , isLoading , isError} = useReadContract({
    abi : ABI,
    address : contractAddress,
    functionName : "getLast10FinalPrices"
  })

  if(isError) {
    return <div>Error while loading</div>
  }

  if(!isLoading){
    for(let i = 2 ; i < 10 ; i++){
      priceData[i-2].price = parseInt(data[i]) / (10 ** 18);
    }
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Price Feed History
          </h3>
          <div className="text-sm text-gray-400">Last 2 hours</div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#9CA3AF' }}
                formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
    
}

export default PriceFeedGraph;