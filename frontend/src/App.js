import React from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import CodeExecutor from './components/CodeExecutor';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/room/:roomCode" element={<CodeExecutor />} />
        <Route path="/" element={<Navigate replace to="/login" />} />

      </Routes>
    </Router>
  );
}