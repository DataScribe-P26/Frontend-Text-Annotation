import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import ProjectModal from "./ProjectModal"; // Import the modal here

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const addProject = (newProject) => {
    const isDuplicate = projects.some(
      (project) => project.name.toLowerCase() === newProject.name.toLowerCase()
    );
    if (isDuplicate) {
      alert("Project name already exists!");
      return;
    }

    setProjects([...projects, newProject]);
    setShowModal(false);
  };

  const handleProjectClick = (projectName) => {
    // Navigate to HomePage with project name as parameter
    navigate(`/project/${projectName}`);
  };

  return (
    <div className="max-w-full mx-auto py-16 px-8 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen font-poppins">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
        Project Hub
      </h1>

      {/* Button to open modal */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold mx-auto mb-12 block hover:bg-indigo-500 shadow-lg"
      >
        + Create New Project
      </button>

      {/* Show message if project list is empty */}
      {projects.length === 0 ? (
        <p className="text-center text-gray-500 text-xl mt-10">
          Your project list is empty. Start by creating a new project!
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              onClick={() => handleProjectClick(project.name)} // Add onClick to handle project click
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" // Add cursor-pointer class for better UX
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {project.name}
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                {project.description}
              </p>
              <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full font-semibold">
                {project.type}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Show modal when button is clicked */}
      {showModal && (
        <ProjectModal
          onAddProject={addProject}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectList;
