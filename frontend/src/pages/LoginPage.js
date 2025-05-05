import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
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

      // Đăng nhập thành công
      login(data.user);
      navigate('/');
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

  return (
    <div className="h-screen bg-[#FFF5E1]">
      <Header />

      <div className="container mx-auto px-4 pt-32">
        <div className="max-w-md mx-auto bg-[#b77f56] rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-white mb-8">LOGIN</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-center bg-white rounded-lg px-4 py-2">
                <FaUser className="text-[#b77f56] mr-2" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="flex-1 outline-none text-[#231f20]"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center bg-white rounded-lg px-4 py-2">
                <FaLock className="text-[#b77f56] mr-2" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="flex-1 outline-none text-[#231f20]"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-center mb-4">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#53382c] text-white py-2 rounded-lg hover:bg-[#3d2a20] transition-colors"
            >
              LOGIN
            </button>

            <p className="text-white text-center mt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#53382c] hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 