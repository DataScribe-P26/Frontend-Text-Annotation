import React from 'react';
import { HiAnnotation } from "react-icons/hi";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-4 py-4 shadow-lg">
      <div className="flex items-center">
        {/* Wrapping the icon and text in a flex container */}
        <HiAnnotation className="mr-2 text-4xl" />
        <h1 className="text-2xl font-bold">Text Annotation Tool</h1>
      </div>
    </nav>
  );
};

export default Navbar;
