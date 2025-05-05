import React from 'react';
import { FaUser } from 'react-icons/fa';

const BlogCard = ({ title, content, author, date }) => {
  return (
    <div className="bg-[#b77f56] rounded-lg p-6 mb-4 transition-transform hover:scale-[1.02]">
      <h2 className="text-left text-xl font-bold mb-2">{title}</h2>
      <p className="text-left text-gray-800 mb-4">{content}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <FaUser className="text-primary mr-1" />
          <span>{author}</span>
        </div>
        <span className="text-sm text-gray-700">{date}</span>
      </div>
    </div>
  );
};

export default BlogCard; 