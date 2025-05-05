import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';

const EditBlogModal = ({ isOpen, onClose, blog, onEditSuccess, onDeleteSuccess }) => {
  const [formData, setFormData] = useState({
    blog_name: '',
    blog_content: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (blog) {
      setFormData({
        blog_name: blog.blog_name,
        blog_content: blog.blog_content
      });
    }
  }, [blog]);

  if (!isOpen || !blog) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/blogs/${blog.id_blog}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      onEditSuccess();
      onClose();
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa blog này?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/blogs/${blog.id_blog}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          onDeleteSuccess();
          onClose();
        } else {
          setError('Có lỗi xảy ra khi xóa blog');
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi xóa blog');
      }
    }
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

        {/* Form chỉnh sửa */}
        <form onSubmit={handleSubmit}>
          {/* Tiêu đề blog */}
          <input
            type="text"
            name="blog_name"
            value={formData.blog_name}
            onChange={handleChange}
            className="w-full text-3xl font-bold text-[#53382c] mb-4 bg-transparent border-b-2 border-[#53382c] focus:outline-none focus:border-[#b77f56]"
          />

          {/* Thông tin tác giả và thời gian */}
          <div className="flex items-center justify-between text-sm text-[#231f20] mb-6">
            <span className="flex items-center gap-2">
              <FaUser />
              {blog.author_name}
            </span>
            <span>{formatDate(blog.post_time)}</span>
          </div>

          {/* Nội dung blog */}
          <textarea
            name="blog_content"
            value={formData.blog_content}
            onChange={handleChange}
            className="w-full h-64 text-[#231f20] bg-transparent border-2 border-[#53382c] rounded-lg p-4 focus:outline-none focus:border-[#b77f56] resize-none"
          />

          {/* Thông báo lỗi */}
          {error && (
            <p className="text-red-500 mt-4">{error}</p>
          )}

          {/* Nút lưu và xóa */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#b77f56] text-white rounded-lg hover:bg-[#a06c47]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogModal; 