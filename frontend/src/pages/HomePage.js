import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import Header from '../components/Header';
import CreateBlogModal from '../components/CreateBlogModal';
import BlogDetailModal from '../components/BlogDetailModal';
import useAuth from '../hooks/useAuth';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6
  });
  const { user, loading, logout } = useAuth();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const currentPage = parseInt(searchParams.get('page')) || 1;

  const fetchBlogs = async (page) => {
    try {
      const response = await fetch(`http://localhost:5000/api/blogs?page=${page}&limit=6`);
      const data = await response.json();
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách blog:', err);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setSearchParams({ page: newPage.toString() });
    }
  };

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#FFF5E1] flex items-center justify-center">
        <div className="text-2xl text-[#53382c]">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#FFF5E1]">
      <Header user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-16">
        {user && (
          <div className="mt-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#b77f56] text-black text-xl font-semibold rounded-3xl hover:bg-[#a06c47]"
            >
              <FaUser className="text-black" />
              NEW BLOG POST....
            </button>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id_blog}
              className="bg-[#b77f56] rounded-lg p-6 shadow-lg w-full h-[180px] flex flex-col justify-between cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleBlogClick(blog)}
            >
              <div className="overflow-hidden">
                <h3 className="text-left text-xl font-bold text-black overflow-hidden overflow-ellipsis whitespace-nowrap mb-2">
                  {blog.blog_name}
                </h3>
                <p className="text-left text-[#231f20] overflow-hidden line-clamp-2">
                  {blog.blog_content}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm text-[#231f20]">
                <span className="flex items-center gap-2">
                  <FaUser />
                  {blog.author_name}
                </span>
                <span>{formatDate(blog.post_time)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12">
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-300 text-gray-500'
                    : 'hover:bg-[#b77f56] hover:text-white'
                }`}
              >
                &lt;
              </button>
              {[...Array(pagination.totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? 'bg-[#b77f56] text-white'
                      : 'hover:bg-[#b77f56] hover:text-white'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === pagination.totalPages
                    ? 'bg-gray-300 text-gray-500'
                    : 'hover:bg-[#b77f56] hover:text-white'
                }`}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Blog Modal */}
      <CreateBlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateSuccess={() => {
          fetchBlogs(currentPage);
          setIsModalOpen(false);
        }}
        username={user?.username}
      />

      {/* Blog Detail Modal */}
      <BlogDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        blog={selectedBlog}
      />
    </div>
  );
};

export default HomePage;