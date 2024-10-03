import React, { useState, useEffect } from 'react';

const CreateLabel = ({ isOpen, onClose, onCreateLabel, currentLabel }) => { // Add currentLabel to props
  const [labelName, setLabelName] = useState('');
  const [labelKey, setLabelKey] = useState('');
  const [labelColor, setLabelColor] = useState('#000000'); // Default color

  useEffect(() => {
    // If editing an existing label, populate the form fields
    if (currentLabel) {
      setLabelName(currentLabel.name);
      setLabelKey(currentLabel.key);
      setLabelColor(currentLabel.color);
    } else {
      // Reset fields when creating a new label
      setLabelName('');
      setLabelKey('');
      setLabelColor('#000000');
    }
  }, [currentLabel]);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!labelName || !labelKey) {
      alert("Please fill out all the fields.");
      return;
    }

    const newLabel = {
      name: labelName,
      key: labelKey,
      color: labelColor,
    };

    console.log("New Label:", newLabel);
    
    // Call the onCreateLabel function to add or update the label
    onCreateLabel(newLabel);

    // Reset the form fields after submission
    setLabelName('');
    setLabelKey('');
    setLabelColor('#000000');
    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null; // Don't render if the modal isn't open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg z-10 p-5" style={{ width: '60%', height: '70%' }}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">✖</button>
        <h2 className="text-2xl font-bold mb-4">{currentLabel ? 'Edit Label' : 'Create a New Label'}</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4 overflow-auto">
          {/* Label Name Input */}
          <div className="group">
            <label className="block text-lg font-semibold text-gray-800 mb-2">Label Name</label>
            <input
              type="text"
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              className="border-2 border-gray-300 p-3 rounded-lg w-full text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-200 transition"
              placeholder="Enter label name"
              required
            />
          </div>

          {/* Label Key Input */}
          <div className="group">
            <label className="block text-lg font-semibold text-gray-800 mb-2">Label Key</label>
            <input
              type="text"
              value={labelKey}
              onChange={(e) => setLabelKey(e.target.value)}
              className="border-2 border-gray-300 p-3 rounded-lg w-full text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-200 transition"
              placeholder="Enter a unique key"
              required
            />
          </div>

          {/* Color Picker */}
          <div className="group">
            <label className="block text-lg font-semibold text-gray-800 mb-2">Label Color</label>
            <input
              type="color"
              value={labelColor}
              onChange={(e) => setLabelColor(e.target.value)}
              className="w-16 h-10 p-1 rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition-shadow shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {currentLabel ? 'Update Label' : 'Create Label'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLabel;
