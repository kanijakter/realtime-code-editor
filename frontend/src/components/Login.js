import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { setToken,getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  // Check authentication on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', { email, password });
      
      setToken(response.data.token);
      navigate('/home');  // Redirect to home upon successful login
    } catch (error) {
      console.error('Login failed', error);
      alert('Invalid login');
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit} class="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
      <div class="text-center mt-4">
        <p>Don't have an account?</p>
        <button
          onClick={() => navigate('/signup')}
          class="mt-2 text-blue-500 hover:underline">
          Signup
        </button>
      </div> 
    </div>
  </div>
  

   
  );
};

export default Login;
