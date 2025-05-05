import React from 'react';
import { FaUser } from 'react-icons/fa';

const BlogDetailModal = ({ isOpen, onClose, blog }) => {
  if (!isOpen || !blog) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#FFF5E1] w-[80%] max-w-3xl max-h-[80vh] rounded-lg p-8 relative overflow-y-auto">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          ×
        </button>

        {/* Tiêu đề blog */}
        <h2 className="text-left text-3xl font-bold text-[#53382c] mb-4">{blog.blog_name}</h2>

        {/* Thông tin tác giả và thời gian */}
        <div className="flex items-center justify-between text-sm text-[#231f20] mb-6">
          <span className="flex items-center gap-2">
            <FaUser />
            {blog.author_name}
          </span>
          <span>{formatDate(blog.post_time)}</span>
        </div>

        {/* Nội dung blog */}
        <div className="text-left text-[#231f20] whitespace-pre-wrap">
          {blog.blog_content}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailModal; 