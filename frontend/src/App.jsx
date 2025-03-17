import Navigation from "./components/Navigation"
import Dashboard from "./pages/Home"
import { Route, Routes } from "react-router-dom"
import AIChat from "./pages/Chat"
import { ToastContainer } from 'react-toastify';
import Home from "./pages/home2";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <ToastContainer/>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/dashboard" element = {<Dashboard/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
