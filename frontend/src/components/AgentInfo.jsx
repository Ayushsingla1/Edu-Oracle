import React from 'react';
import { Bot, Clock, Cpu, Zap, Radio } from 'lucide-react';

function AgentInfo() {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
        <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-emerald-400" />
          AI Agent Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="font-medium text-white">15-Min Updates</h4>
            </div>
            <p className="text-gray-400 text-sm">Submits price data to blockchain every 15 minutes</p>
          </div>
          <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Cpu className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="font-medium text-white">AI-Powered</h4>
            </div>
            <p className="text-gray-400 text-sm">Advanced AI algorithms for accurate price analysis</p>
          </div>
          <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Radio className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="font-medium text-white">Oracle Service</h4>
            </div>
            <p className="text-gray-400 text-sm">Reliable off-chain data feed to blockchain</p>
          </div>
          <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="font-medium text-white">Performance</h4>
            </div>
            <p className="text-gray-400 text-sm">98.2% uptime with real-time monitoring</p>
          </div>
        </div>
      </div>
    );
}
  

export default AgentInfo;