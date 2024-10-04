import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const FileContentDisplay = () => {
  const location = useLocation();
  const { fileContent, fileType } = location.state || {
    fileContent: [],
    fileType: "text",
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const [annotations, setAnnotations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const labels = [
    { key: "person", name: "Person", color: "border-red-500" },
    { key: "organization", name: "Organization", color: "border-green-500" },
    { key: "location", name: "Location", color: "border-blue-500" },
  ];

  const handleTextSelect = () => {
    const selection = window.getSelection().toString().trim();
    if (selection) {
      setSelectedText(selection);
      setErrorMessage("");
    } else {
      setSelectedText("");
    }
  };

  const handleLabelChange = (event) => {
    const labelKey = event.target.value;
    const label = labels.find((label) => label.key === labelKey);

    if (label && selectedText) {
      const exists = annotations.some(
        (annotation) =>
          annotation.text === selectedText &&
          (fileType === "text" || annotation.index === currentIndex)
      );

      if (!exists) {
        const annotation = {
          text: selectedText,
          label: label,
          index: fileType === "text" ? -1 : currentIndex,
        };
        setAnnotations((prevAnnotations) => [...prevAnnotations, annotation]);
        setSelectedText("");
      } else {
        setErrorMessage("This text has already been annotated.");
      }
    }
  };

  const colorizeJsonText = (jsonString) => {
    let result = jsonString;
    const annotationsSorted = annotations
      .filter((annotation) => annotation.index === currentIndex)
      .sort((a, b) => b.text.length - a.text.length);

    annotationsSorted.forEach((annotation) => {
      const escapedText = annotation.text.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      const regex = new RegExp(`(${escapedText})`, "g");
      result = result.replace(
        regex,
        `<span class="border-b-2 ${annotation.label.color}">$1</span>`
      );
    });
    return result;
  };

  const renderContent = () => {
    if (fileType === "text") {
      return (
        <div className="whitespace-pre-wrap">
          {fileContent.map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {(() => {
                let lineContent = line;
                const lineAnnotations = annotations.sort(
                  (a, b) => b.text.length - a.text.length
                );

                const parts = [];
                let lastIndex = 0;

                lineAnnotations.forEach((annotation) => {
                  const index = lineContent.indexOf(annotation.text, lastIndex);
                  if (index !== -1) {
                    // Add text before annotation
                    if (index > lastIndex) {
                      parts.push(
                        <span key={`text-${lastIndex}-${index}`}>
                          {lineContent.slice(lastIndex, index)}
                        </span>
                      );
                    }
                    // Add annotated text
                    parts.push(
                      <span
                        key={`annotation-${index}`}
                        className={`border-b-2 ${annotation.label.color}`}
                      >
                        {annotation.text}
                      </span>
                    );
                    lastIndex = index + annotation.text.length;
                  }
                });

                // Add remaining text
                if (lastIndex < lineContent.length) {
                  parts.push(
                    <span key={`text-${lastIndex}-end`}>
                      {lineContent.slice(lastIndex)}
                    </span>
                  );
                }

                return parts.length > 0 ? parts : lineContent;
              })()}
              {lineIndex < fileContent.length - 1 && "\n"}
            </React.Fragment>
          ))}
        </div>
      );
    } else if (fileType === "json") {
      const content = fileContent[currentIndex];
      const colorizedJson = colorizeJsonText(JSON.stringify(content, null, 2));
      return (
        <pre
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: colorizedJson }}
        />
      );
    }
  };

  const renderAnnotations = () => {
    const filteredAnnotations = annotations.filter(
      (annotation) => fileType === "text" || annotation.index === currentIndex
    );

    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Annotations</h3>
        {filteredAnnotations.length === 0 ? (
          <p className="text-gray-500">No annotations yet</p>
        ) : (
          <div className="space-y-2">
            {filteredAnnotations.map((annotation, index) => (
              <div
                key={index}
                className="flex items-center p-2 bg-gray-50 rounded"
              >
                <span className="text-sm font-medium">
                  <span className={`border-b-2 ${annotation.label.color}`}>
                    {annotation.label.name}
                  </span>
                </span>
                <span className="ml-2 text-gray-700">{annotation.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderNavigation = () => {
    if (fileType === "json") {
      return (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className={`bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-shadow shadow-lg ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Previous
          </button>
          <span className="self-center text-gray-700">
            Item {currentIndex + 1} of {fileContent.length}
          </span>
          <button
            onClick={() =>
              setCurrentIndex(
                Math.min(fileContent.length - 1, currentIndex + 1)
              )
            }
            disabled={currentIndex === fileContent.length - 1}
            className={`bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-shadow shadow-lg ${
              currentIndex === fileContent.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Next
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-8 bg-gradient-to-r from-blue-50 to-blue-100 overflow-auto">
          <div className="max-w-[74vw] mx-auto">
            <h2 className="text-3xl font-bold mb-6">File Content Display</h2>

            <div className="flex flex-col space-y-4">
              <div
                className="bg-white p-4 rounded-lg shadow-md relative"
                onMouseUp={handleTextSelect}
              >
                <div
                  className="text-xl font-semibold"
                  style={{
                    maxHeight: "calc(100vh - 400px)",
                    overflowY: "auto",
                    overflowX: "auto",
                  }}
                >
                  {renderContent()}
                </div>

                {selectedText && (
                  <div className="mt-4">
                    <select
                      onChange={handleLabelChange}
                      className="w-full p-2 border rounded"
                      value=""
                    >
                      <option value="">
                        Select a label for "{selectedText}"
                      </option>
                      {labels.map((label) => (
                        <option key={label.key} value={label.key}>
                          {label.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {errorMessage && (
                  <div className="text-red-600 mt-2">{errorMessage}</div>
                )}
              </div>

              {renderNavigation()}
              {renderAnnotations()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileContentDisplay;
