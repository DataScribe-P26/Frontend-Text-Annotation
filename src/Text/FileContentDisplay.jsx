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

  // Updated to include both background colors and text colors for contrast
  const labels = [
    {
      key: "person",
      name: "Person",
      color: "#ef4444",
      bgColor: "#fef2f2",
      textColor: "#991b1b",
    },
    {
      key: "organization",
      name: "Organization",
      color: "#22c55e",
      bgColor: "#f0fdf4",
      textColor: "#166534",
    },
    {
      key: "location",
      name: "Location",
      color: "#3b82f6",
      bgColor: "#eff6ff",
      textColor: "#1e40af",
    },
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
        `<span style="background-color: ${annotation.label.bgColor}; color: ${annotation.label.textColor}">$1</span>`
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
                    if (index > lastIndex) {
                      parts.push(
                        <span key={`text-${lastIndex}-${index}`}>
                          {lineContent.slice(lastIndex, index)}
                        </span>
                      );
                    }
                    parts.push(
                      <span
                        key={`annotation-${index}`}
                        style={{
                          backgroundColor: annotation.label.bgColor,
                          color: annotation.label.textColor,
                          padding: "0.1rem 0.2rem",
                          borderRadius: "0.2rem",
                        }}
                      >
                        {annotation.text}
                      </span>
                    );
                    lastIndex = index + annotation.text.length;
                  }
                });

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
      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Annotations
        </h3>
        {filteredAnnotations.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No annotations yet</p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {filteredAnnotations.map((annotation, index) => (
              <div
                key={index}
                className=" bg-gray-100"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.7rem",
                  borderRadius: "0.3rem",
                }}
              >
                <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                  <div
                    style={{
                      backgroundColor: annotation.label.textColor,
                      color: "white",
                      borderRadius: "0.375rem",
                      padding: "0.25rem 0.5rem",
                    }}
                  >
                    {annotation.label.key}
                  </div>
                </span>

                <span
                  className="annotation-text w-[85%]  text-ellipsis whitespace-nowrap custom-scrollbar"
                  style={{
                    marginLeft: "1rem",
                    color: "black",
                    padding: "0.1rem 0.2rem",
                    borderRadius: "0.2rem",
                    whiteSpace: "nowrap",
                    overflow: "auto",
                    textOverflow: "ellipsis",
                  }}
                >
                  {annotation.text}
                </span>

                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    gap: "0.5rem",
                  }}
                >
                  <button
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      borderRadius: "0.375rem",
                      padding: "0.25rem 0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            style={{
              backgroundColor: "#4f46e5",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              opacity: currentIndex === 0 ? 0.5 : 1,
              cursor: currentIndex === 0 ? "not-allowed" : "pointer",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            Previous
          </button>
          <span style={{ alignSelf: "center", color: "#374151" }}>
            Item {currentIndex + 1} of {fileContent.length}
          </span>
          <button
            onClick={() =>
              setCurrentIndex(
                Math.min(fileContent.length - 1, currentIndex + 1)
              )
            }
            disabled={currentIndex === fileContent.length - 1}
            style={{
              backgroundColor: "#4f46e5",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              opacity: currentIndex === fileContent.length - 1 ? 0.5 : 1,
              cursor:
                currentIndex === fileContent.length - 1
                  ? "not-allowed"
                  : "pointer",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            Next
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", flexGrow: 1 }}>
        <Sidebar />
        <div
          className="custom-scrollbar"
          style={{
            flexGrow: 1,
            padding: "2rem",
            background: "linear-gradient(to right, #eff6ff, #dbeafe)",
            overflowY: "auto",
          }}
        >
          <div style={{ maxWidth: "74vw", margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "1.875rem",
                fontWeight: "bold",
                marginBottom: "1.5rem",
              }}
            >
              File Content Display
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                }}
                onMouseUp={handleTextSelect}
              >
                <div
                  className="custom-scrollbar"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    maxHeight: "calc(100vh - 400px)",
                    overflowY: "auto",
                    overflowX: "auto",
                  }}
                >
                  {renderContent()}
                </div>

                {selectedText && (
                  <div style={{ marginTop: "1rem" }}>
                    <select
                      onChange={handleLabelChange}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.25rem",
                      }}
                      value=""
                    >
                      <option value="">Select a label</option>
                      {labels.map((label) => (
                        <option key={label.key} value={label.key}>
                          {label.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {errorMessage && (
                  <div style={{ color: "#dc2626", marginTop: "0.5rem" }}>
                    {errorMessage}
                  </div>
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
