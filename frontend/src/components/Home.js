import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import CodeExecutor from './CodeExecutor'
const Home = () => {
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h2 class="text-3xl font-bold mb-6">Welcome Home!</h2>
      <CodeExecutor/>
      <button
        onClick={handleLogout}
        class="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  </div>
  
  );
};

export default Home;
