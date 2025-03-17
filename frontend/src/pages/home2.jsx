import React, { useState, useEffect } from 'react';
import { Bot, Award, CheckCircle, BarChart3, Wallet, BookOpen, Zap, Clipboard, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto px-6 py-12 relative overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 10 }}
    >
      {/* Multiple Background Animations */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-transparent opacity-20 blur-3xl"
        animate={{ x: [0, 100, 0], opacity: [0.1, 0.3, 0.1] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-blue-500 to-transparent opacity-10 blur-3xl"
        animate={{ y: [0, 50, 0], opacity: [0.05, 0.2, 0.05] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
      />
      
      <motion.div 
        className="absolute top-32 right-0 h-64 w-64 rounded-full bg-purple-500 opacity-10 blur-3xl"
        animate={{ 
          scale: [1, 1.5, 1],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />
      
      {/* Header Section with Animation */}
      <motion.div 
        className="text-center mb-12 pointer-events-none"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1 
          className="text-5xl font-bold text-white flex items-center justify-center gap-3"
          animate={{ 
            textShadow: ["0 0 0px rgba(52, 211, 153, 0)", "0 0 10px rgba(52, 211, 153, 0.5)", "0 0 0px rgba(52, 211, 153, 0)"]
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <Bot className="text-emerald-400" />
          </motion.div>
          Next-Gen AI Oracle
        </motion.h1>
        <motion.p 
          className="text-gray-400 max-w-3xl mx-auto mt-4 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          The most <motion.span 
            className="font-bold text-emerald-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >powerful, fast, and decentralized</motion.span> AI-integrated oracle for price feeds, staking rewards, and seamless blockchain interactions.
        </motion.p>
      </motion.div>

      {/* Feature Cards with Staggered Animation */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        variants={container}
        initial="hidden"
        animate="show"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
      >
        <FeatureCard variants={item} icon={Award} title="Earn Rewards" description="Stake tokens, contribute accurate data, and earn high-yield ERC-20 rewards." />
        <FeatureCard variants={item} icon={Wallet} title="Fully Decentralized" description="Built on Sonic, ensuring trustless, transparent data flow." />
        <FeatureCard variants={item} icon={BarChart3} title="Live Price Feeds" description="Access real-time price data with unparalleled accuracy and speed." />
        <FeatureCard variants={item} icon={CheckCircle} title="Fair Incentives" description="Contributors earn for correct submissions; inaccurate data gets slashed." />
        <FeatureCard variants={item} icon={Bot} title="AI Chatbot Assistance" description="Execute transactions, stake tokens, and analyze data through an AI assistant." />
        <FeatureCard variants={item} icon={Zap} title="Next-Level Performance" description="More efficient and cost-effective than Chainlink & Pyth, powered by AI optimization." />
      </motion.div>

      {/* Docs Section with Typing Effect */}
      <motion.div 
        className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-md -z-40 pointer-events-none"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="flex items-center gap-3 mb-4"
          whileHover={{ x: 5 }}
        >
          <motion.div
            animate={{ rotate: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <BookOpen className="text-emerald-400 w-8 h-8" />
          </motion.div>
          <h3 className="text-xl font-semibold text-white">Setup & Integration Guide</h3>
        </motion.div>
        
        <CodeItem delay={0.1} text="1. Clone the repository:" code="git clone https://github.com/Ayushsingla1/Agentic-Oracle" />
        <CodeItem delay={0.3} text="2. Navigate to the project directory:" code="cd backend" />
        <CodeItem delay={0.5} text="3. Install dependencies:" code="npm install" />
        <CodeItem delay={0.7} text="4. Configure environment variables:" code="cp .env.example .env" />
        
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          Edit the <code>.env</code> file and add your <motion.span 
            className="font-bold text-emerald-400"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >private key</motion.span>, contract address, and necessary API keys.
        </motion.p>
        
        <CodeItem delay={1.1} text="5. Start the server:" code="npm run dev" />
        
        <motion.p 
          className="text-gray-400 mt-4 pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          For detailed integration and API references, check our {''}
          <motion.a 
            href="https://flame-skink-53c.notion.site/AI-Agents-Blockchain-System-Documentation-194ba4f18c828042ac84ecdfea9f6851?pvs=74" 
            className="text-emerald-400 underline pointer-events-auto"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            target='_blank'
            animate={{ 
              textShadow: ["0 0 0px rgba(52, 211, 153, 0)", "0 0 4px rgba(52, 211, 153, 0.8)", "0 0 0px rgba(52, 211, 153, 0)"]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            full documentation
          </motion.a>.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

function CodeItem({ delay, text, code }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className='z-50'>
        <motion.p 
        className="text-gray-400 mt-4 mb-2"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{ delay, duration: 0.5 }}
      >
        {text}
      </motion.p>
      <motion.div className='flex justify-between pointer-events-none'>
      <motion.code 
        className="block bg-gray-900 text-emerald-400 p-2 rounded w-full pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: delay + 0.1, duration: 0.5 }}
        whileHover={{ 
          scale: 1.02, 
          boxShadow: "0 0 8px rgba(52, 211, 153, 0.5)" 
        }}
      >
        {code}
      </motion.code>
      <motion.div>
      <motion.button onClick={handleCopy} className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition z-50 poin pointer-events-auto">
          {
            copied ? (<Check/>) : (<Clipboard className="w-5 h-5 text-emerald-400 z-40" />)
          }
      </motion.button>
      </motion.div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, variants }) {
  return (
    <motion.div 
      className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-md"
      variants={variants}
      whileHover={{ 
        scale: 1.05, 
        rotate: 2,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          <Icon className="text-emerald-400 w-8 h-8" />
        </motion.div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </motion.div>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}