import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { AiOutlineCopy } from 'react-icons/ai';

const socket = io('http://localhost:5000');

const languages = [
  { language: 'javascript', version: '1.32.3' },
  { language: 'c', version: '10.2.0' },
  { language: 'c++', version: '10.2.0' },
  { language: 'java', version: '15.0.2' },
  { language: 'python', version: '3.10.0' }
];

function CodeExecutor() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeMemberCount, setActiveMemberCount] = useState(0);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    
    socket.emit('join_room', roomCode);

    socket.on('active_member_count', (count) => {
      setActiveMemberCount(count);
    });

    socket.on('receive_code', (receivedCode) => {
      setCode(receivedCode);
    });

    const handleTabClose = () => {
      socket.emit('leave_room', roomCode);
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      socket.off('receive_code');
      socket.emit('leave_room', roomCode);
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, [roomCode]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    socket.emit('send_code', newCode, roomCode);
  };

  const executeCode = async () => {
    const options = {
      method: 'POST',
      url: 'https://emkc.org/api/v2/piston/execute',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        language: selectedLanguage.language,
        version: selectedLanguage.version,
        files: [{ name: 'main.js', content: code }]
      }
    };

    try {
      const response = await axios(options);
      setOutput(response.data.run.output);
    } catch (error) {
      setOutput('Error: ' + error.message);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Navbar */}
      <div className="w-full max-w-5xl flex justify-between items-center py-4 mb-6 bg-white shadow-md rounded-lg px-6">
        <h1 className="text-2xl font-bold text-blue-600">Code Editor</h1>

        {/* Active Member Count */}
        <div className="text-lg font-semibold text-gray-700">
          Active Members: <span id="active-members-count">{activeMemberCount}</span>
        </div>

        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {/* Code Editor Section */}
        <div className="flex flex-col w-full md:w-1/2 bg-white shadow-lg rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            {/* Language Selector */}
            <select
              className="p-2 border border-gray-300 rounded-md text-gray-700"
              value={selectedLanguage.language}
              onChange={(e) => {
                const selected = languages.find(lang => lang.language === e.target.value);
                setSelectedLanguage(selected);
              }}
            >
              {languages.map((lang, index) => (
                <option key={index} value={lang.language}>
                  {lang.language}
                </option>
              ))}
            </select>
            {/* Execute Button */}
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={executeCode}
            >
              Run
            </button>
          </div>

          {/* Code Input Box */}
          <textarea
            className="w-full h-64 p-2 border border-gray-300 rounded-md resize-none text-gray-800"
            placeholder="Write your code here..."
            value={code}
            onChange={handleCodeChange}
          ></textarea>
        </div>

        {/* Output Section */}
        <div className="flex flex-col w-full md:w-1/2 bg-white shadow-lg rounded-lg p-4">
          {/* Copyable Room URL */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Room URL:</span>
              <span className="text-blue-500 font-medium">{window.location.href}</span>
              <CopyToClipboard
                text={window.location.href}
                onCopy={() => setCopied(true)}
              >
                <button className="text-gray-500 hover:text-blue-500">
                  <AiOutlineCopy size={20} />
                </button>
              </CopyToClipboard>
              {copied && <span className="text-green-500 text-sm ml-2">Copied!</span>}
            </div>
          </div>

          {/* Output Display */}
          <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-md">
            <h2 className="font-semibold text-gray-700 mb-2">Output:</h2>
            <pre className="text-gray-800">{output || 'Output will be displayed here...'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeExecutor;
