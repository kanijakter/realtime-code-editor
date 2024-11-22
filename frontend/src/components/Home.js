import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import { nanoid } from 'nanoid';

const Home = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');

  
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

  const createRoom = () => {
    const newRoomCode = nanoid(6);
    navigate(`/room/${newRoomCode}`);
  };

  const joinRoom = () => {
    if (roomCode.trim()) {
      navigate(`/room/${roomCode}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Join or Create a Room</h1>
        <div className="space-y-4">
          <button
            onClick={createRoom}
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Create New Room
          </button>
          <input
            type="text"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <button
            onClick={joinRoom}
            className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600"
          >
            Join Room
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
