import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaUser, FaPen } from 'react-icons/fa';
import Header from '../components/Header';
import CreateBlogModal from '../components/CreateBlogModal';
import BlogDetailModal from '../components/BlogDetailModal';
import EditBlogModal from '../components/EditBlogModal';
import useAuth from '../hooks/useAuth';

const MyBlogsPage = () => {
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    // Kiểm tra nếu không có user thì chuyển về trang chủ
    if (!loading && !user) {
      navigate('/');
      return;
    }
  }, [user, loading, navigate]);

  const fetchMyBlogs = async (page) => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/blogs/user/${user.username}?page=${page}&limit=6`);
      const data = await response.json();
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách blog:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBlogs(currentPage);
    }
  }, [currentPage, user]);

  const handleLogout = () => {
    logout();
  };

  const handleDeleteBlog = async (blogId, event) => {
    event.stopPropagation(); // Ngăn sự kiện click lan ra thẻ cha
    if (window.confirm('Bạn có chắc chắn muốn xóa blog này?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Refresh danh sách blog sau khi xóa
          fetchMyBlogs(currentPage);
        } else {
          alert('Có lỗi xảy ra khi xóa blog');
        }
      } catch (err) {
        console.error('Lỗi khi xóa blog:', err);
        alert('Có lỗi xảy ra khi xóa blog');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
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

  const handleEditClick = (blog, event) => {
    event.stopPropagation(); // Ngăn sự kiện click lan ra thẻ cha
    setSelectedBlog(blog);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#FFF5E1] flex items-center justify-center">
        <div className="text-2xl text-[#53382c]">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen bg-[#FFF5E1]">
      <Header user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-16">
        <div className="mt-10 flex justify-between items-center">
          <h1 className="text-left text-3xl font-bold text-[#000000]">MY BLOGS: <span className="text-4xl font-serif text-[#88878e] italic underline">{user.username}</span></h1>
        
          {user && (
            <div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#b77f56] text-black text-xl font-semibold rounded-3xl hover:bg-[#a06c47]"
              >
                <FaUser className="text-black" />
                NEW BLOG POST....
              </button>
            </div>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id_blog}
              className="bg-[#b77f56] rounded-lg p-6 shadow-lg w-full h-[180px] flex flex-col justify-between relative cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleBlogClick(blog)}
            >
              <button
                onClick={(e) => handleEditClick(blog, e)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-[#53382c] text-white rounded-full hover:bg-[#3d2a20]"
              >
                <FaPen className="w-4 h-4" />
              </button>
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
          fetchMyBlogs(currentPage);
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

      {/* Edit Blog Modal */}
      <EditBlogModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        blog={selectedBlog}
        onEditSuccess={() => {
          fetchMyBlogs(currentPage);
          setIsEditModalOpen(false);
        }}
        onDeleteSuccess={() => {
          fetchMyBlogs(currentPage);
          setIsEditModalOpen(false);
        }}
      />
    </div>
  );
};

export default MyBlogsPage; 