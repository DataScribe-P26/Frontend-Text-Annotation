import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectModal from './ProjectModal';  // Import the modal here
import { PlusIcon } from '@heroicons/react/24/solid'; // Make sure @heroicons/react is installed
import { FaProjectDiagram } from 'react-icons/fa'; // Import a project icon for better UI

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const addProject = (newProject) => {
    const isDuplicate = projects.some(project => project.name.toLowerCase() === newProject.name.toLowerCase());
    if (isDuplicate) {
      alert("Project name already exists!");
      return;
    }

    setProjects([...projects, newProject]);
    setShowModal(false);
  };

  const handleProjectClick = (projectName) => {
    navigate(`/project/${projectName}`); // Fixed template string
  };
  const styles = {
    slideIn: {
      animation: 'slideIn 0.5s ease-out',
      '@keyframes slideIn': {
        from: {
          opacity: 0,
          transform: 'translateY(-20px)',
        },
        to: {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
    },
  };

  return (

    <div className="max-w-full mx-auto py-16 px-8 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen font-poppins">
      {/* Welcome Banner */}
      <div style={styles.slideIn} className="bg-indigo-600 text-white p-8 rounded-xl shadow-md mb-12">
  <h1 className="text-5xl font-extrabold text-center mb-4">Welcome to Text Annotation Hub</h1>
        <p className="text-center text-lg font-medium">Manage and annotate your projects with ease.</p>
      </div>


      {/* Button to open modal */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold mx-auto mb-12 block hover:bg-indigo-500 shadow-lg flex items-center justify-center space-x-2"
      >
        <PlusIcon className="w-6 h-6" />
        <span>Create New Project</span>
      </button>

      {/* Show message if project list is empty */}
      {projects.length === 0 ? (
        <p className="text-center text-gray-500 text-xl mt-10">Your project list is empty. Start by creating a new project!</p>
      ) : (
        <div className="grid grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              onClick={() => handleProjectClick(project.name)}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer hover:scale-105 transform transition-transform"
            >
              {/* Project Icon */}
              <FaProjectDiagram className="w-8 h-8 text-indigo-600 mb-4" />

              <h2 className="text-2xl font-bold text-gray-800 mb-4">{project.name}</h2>
              <p className="text-gray-600 text-lg mb-6">{project.description}</p>
              <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full font-semibold">{project.type}</span>
            </div>
          ))}
        </div>
      )}

      {/* Show modal when button is clicked */}
      {showModal && <ProjectModal onAddProject={addProject} onClose={() => setShowModal(false)} />}
    </div>


  );

};


export default ProjectList;
