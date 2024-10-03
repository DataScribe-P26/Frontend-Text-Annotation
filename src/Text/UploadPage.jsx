import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from './Navbar'; // Adjust the path as necessary
import Sidebar from './Sidebar'; // Adjust the path as necessary

const UploadPage = () => {
  const [fileType, setFileType] = useState('text'); // Default file type
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState([]); // Store file content lines
  const navigate = useNavigate(); // Initialize navigate

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Set the selected file
  };

  const handleFileUpload = () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;

      // Handle different file types
      if (fileType === 'text' || fileType === 'text-line') {
        setFileContent(content.split('\n')); // Split text by lines
      } else if (fileType === 'jsonl') {
        const jsonLines = content.split('\n').map(line => JSON.parse(line));
        setFileContent(jsonLines); // Assuming each line is a JSON object
      }

      // Navigate to the FileContentDisplay page
      navigate('/FileContentDisplay', { state: { fileContent: content.split('\n') } }); // Pass fileContent

      // Reset the state after upload
      setFile(null);
    };

    reader.readAsText(file); // Read the file as text
    console.log(`Uploading file: ${file.name} of type: ${fileType}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-8 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-3xl font-bold mb-6">Upload Files</h2>
          <p className="text-gray-700 mb-4">Please select the type of file you want to upload.</p>

          <div className="mb-4">
  <label className="block text-gray-700 mb-2">Select File Type:</label>
  <div className="relative">
    <select
      value={fileType}
      onChange={(e) => setFileType(e.target.value)}
      className="block w-64 bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition duration-150 ease-in-out"
    >
      <option value="text">Text File (.txt)</option>
      <option value="jsonl">JSONL File (.jsonl)</option>
      <option value="text-line">Text Line Format</option>
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
  </div>
</div>


          {/* Custom file input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Choose File:</label>
            <div className="relative">
              <input
                type="file"
                accept={fileType === 'text' ? '.txt' : fileType === 'jsonl' ? '.jsonl' : '.txt'}
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 z-50 cursor-pointer" // Hide the default input field
              />
              <button
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
              >
                Choose File
              </button>
              {file && (
                <span className="ml-4 text-gray-700">{file.name}</span> // Show the selected file name
              )}
            </div>
          </div>

          <div className="flex justify-center items-center min-h-[300px]">
  <button
    onClick={handleFileUpload}
    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-shadow shadow-lg"
  >
    Upload
  </button>
</div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
