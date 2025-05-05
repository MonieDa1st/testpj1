import React, { useState } from 'react';

const CreateBlogModal = ({ isOpen, onClose, onCreateSuccess, username }) => {
  const [formData, setFormData] = useState({
    blog_name: '',
    blog_content: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          author_name: username
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      // Reset form và đóng modal
      setFormData({ blog_name: '', blog_content: '' });
      onCreateSuccess();
      onClose();
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl mx-4">
        <h2 className="text-2xl font-bold mb-6">Create New Blog Post</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-left text-gray-700 mb-2">Blog Title</label>
            <input
              type="text"
              name="blog_name"
              value={formData.blog_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-left text-gray-700 mb-2">Blog Content</label>
            <textarea
              name="blog_content"
              value={formData.blog_content}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 h-40"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#b77f56] text-white rounded hover:bg-[#a06c47]"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogModal; 