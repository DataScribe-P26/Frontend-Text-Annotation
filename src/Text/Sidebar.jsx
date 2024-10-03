import React, { useState } from 'react';
import { AiOutlineDatabase, AiOutlineTag } from 'react-icons/ai'; // Icons for Dataset and Label
import { FiUpload } from "react-icons/fi";
import { LuDownload } from "react-icons/lu";
import { Link } from 'react-router-dom'; // Ensure this import is included

const Sidebar = () => {
  const [isDatasetOpen, setDatasetOpen] = useState(false);

  return (
    <div className="flex flex-col bg-white h-screen w-64 p-5 shadow-xl border-r border-gray-200">
      <h2 className="text-lg font-semibold mb-5">Menu</h2>
      <ul className="space-y-3">
        <li>
          <button
            className="flex items-center w-full text-left p-3 rounded-lg hover:bg-indigo-500 hover:text-white transition"
            onClick={() => setDatasetOpen(!isDatasetOpen)}
          >
            <AiOutlineDatabase className="mr-2" />
            Dataset
          </button>
          {isDatasetOpen && (
            <ul className="pl-4 mt-2 space-y-1">
              <li>
                <Link 
                  to="/uploadPage" 
                  className="flex items-center w-full text-left p-2 rounded-lg hover:bg-indigo-100 transition"
                >
                  <FiUpload className="mr-2" />
                  Import
                </Link>
              </li>
              <li>
                <button className="flex items-center w-full text-left p-2 rounded-lg hover:bg-indigo-100 transition">
                  <LuDownload className="mr-2" />
                  Export
                </button>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link 
            to="/labelManager" // Navigate to LabelManager page
            className="flex items-center w-full text-left p-3 rounded-lg hover:bg-indigo-500 hover:text-white transition"
          >
            <AiOutlineTag className="mr-2" />
            Label
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
