import React, { useState } from 'react';
import axios from 'axios';

const languages = [
  { language: 'javascript', version: '1.32.3' },
  { language: 'c', version: '10.2.0' },
  { language: 'c++', version: '10.2.0' },
  { language: 'java', version: '15.0.2' },
  { language: 'python', version: '3.10.0' }
];

function CodeExecutor() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Code Executor</h1>
  
      <div className="flex items-center mb-4">
        {/* Language Selector */}
        <select
          className="p-2 border border-gray-300 rounded-md mr-2"
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
  
        {/* Submit Button */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={executeCode}
        >
          Submit
        </button>
      </div>
  
      {/* Code Input Box */}
      <textarea
        className="w-96 h-40 p-2 border border-gray-300 rounded-md mb-4"
        placeholder="Write your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>
  
      {/* Output Section */}
      {output && (
        <div className="mt-4 w-full max-w-md p-4 bg-white border border-gray-300 rounded-md">
          <h2 className="font-semibold mb-2">Output:</h2>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
  


}

export default CodeExecutor;
