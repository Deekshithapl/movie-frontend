import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import PaymentHistory from './pages/PaymentHistory';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/payments" element={<PaymentHistory />} />
        </Routes>
        
        <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>© 2024 MovieHub. Built with ❤️ using MERN Stack</p>
            <p className="text-sm mt-2">💳 Secure Payments by Razorpay</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;