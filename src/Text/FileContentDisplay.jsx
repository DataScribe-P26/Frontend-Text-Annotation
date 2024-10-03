import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const FileContentDisplay = () => {
  const location = useLocation();
  const { fileContent } = location.state || { fileContent: [] };

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [selectedText, setSelectedText] = useState('');
  const [annotations, setAnnotations] = useState([]); // To store annotations
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const labels = [
    { key: 'person', name: 'Person', color: 'bg-red-300' },
    { key: 'organization', name: 'Organization', color: 'bg-green-300' },
    { key: 'location', name: 'Location', color: 'bg-blue-300' },
  ];

  const nextLine = () => {
    if (currentLineIndex < fileContent.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
    }
  };

  const previousLine = () => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex(currentLineIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        nextLine();
      } else if (event.key === 'ArrowLeft') {
        previousLine();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentLineIndex]);

  const handleTextSelect = () => {
    const selection = window.getSelection().toString();
    if (selection) {
      setSelectedText(selection);
      setShowDropdown(true);
      setErrorMessage(''); // Reset error message
    }
  };

  const handleLabelChange = (event) => {
    const labelKey = event.target.value;
    const label = labels.find((label) => label.key === labelKey);

    if (label && selectedText) {
      const trimmedText = selectedText.trim();
      const exists = annotations.some(
        (annotation) => annotation.text === trimmedText && annotation.lineIndex === currentLineIndex
      );

      if (!exists) {
        const annotation = {
          text: trimmedText,
          label: label,
          lineIndex: currentLineIndex,
        };
        setAnnotations((prevAnnotations) => [...prevAnnotations, annotation]);
        setSelectedText('');
        setShowDropdown(false); // Hide dropdown after label is selected
      } else {
        setErrorMessage('This word has already been annotated.');
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-8 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-3xl font-bold mb-6">File Content Display</h2>

          {/* Display current line */}
          <div
            className="text-xl font-semibold mb-4 bg-white p-4 rounded-lg shadow-md relative"
            onMouseUp={handleTextSelect}
          >
            {fileContent[currentLineIndex].split(/(\s+)/).map((part, index) => {
              const annotated = annotations.find(
                (annotation) => annotation.text === part.trim() && annotation.lineIndex === currentLineIndex
              );
              return (
                <span
                  key={index}
                  className={annotated ? `${annotated.label.color} p-1 mx-1 rounded` : 'mx-1'}
                >
                  {part} {/* Maintain the spaces correctly */}
                </span>
              );
            })}

            {/* Line Indicator */}
            <div className="absolute bottom-2 right-2 text-gray-700 text-sm">
              Line <span className="font-bold">{currentLineIndex + 1}</span> of{' '}
              <span className="font-bold">{fileContent.length}</span>
            </div>
          </div>

          {/* Show dropdown when text is selected */}
          {showDropdown && (
            <select onChange={handleLabelChange} className="mb-4 p-2 border rounded">
              <option value="">Select a label</option>
              {labels.map((label) => (
                <option key={label.key} value={label.key}>
                  {label.name}
                </option>
              ))}
            </select>
          )}

          {/* Display error message if any */}
          {errorMessage && <div className="text-red-600 mb-2">{errorMessage}</div>}

          {/* Display annotations for the current line */}
          {annotations
            .filter((annotation) => annotation.lineIndex === currentLineIndex)
            .map((annotation, index) => (
              <div key={index} className="mt-2 text-sm">
                <span className={`font-bold ${annotation.label.color} text-white p-1 rounded`}>
                  {annotation.label.name}:
                </span>
                <span className="ml-1">{annotation.text}</span>
              </div>
            ))}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={previousLine}
              disabled={currentLineIndex === 0}
              className={`bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-shadow shadow-lg ${
                currentLineIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Previous
            </button>
            <button
              onClick={nextLine}
              disabled={currentLineIndex === fileContent.length - 1}
              className={`bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-shadow shadow-lg ${
                currentLineIndex === fileContent.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileContentDisplay;
