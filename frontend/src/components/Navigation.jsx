import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className='flex justify-between items-center h-16'>
       <div className="flex h-16 items-center gap-4">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isActive('/') 
                ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            to="/chat"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isActive('/chat') 
                ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            AI Chat
          </Link>
        </div>
        <div><ConnectButton/></div>
       </div>
      </div>
    </nav>
  );
}