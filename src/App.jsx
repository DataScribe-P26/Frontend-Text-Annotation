import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter
import HomePage from './Text/Homepage';
import UploadPage from './Text/UploadPage';
import CreateLabel from './Text/CreateLabel';
import ProjectList from './ProjectStructure/ProjectList';
import FileContentDisplay from './Text/FileContentDisplay';
import LabelManager from './Text/LabelManager';

function App() {
  return (
    <Router> {/* Wrap your entire app in Router */}
      <Routes>
      <Route path="/" element={<ProjectList />} />
      <Route path="/project/:projectName" element={<HomePage />} />
        
        <Route path="/UploadPage" element={<UploadPage />} />
        <Route path="/FileContentDisplay" element={<FileContentDisplay />} />
        <Route path="/CreateLabel" element={<CreateLabel />} />
        <Route path="/labelManager" element={<LabelManager />} />
      </Routes>
    </Router>
  );
}

export default App;

