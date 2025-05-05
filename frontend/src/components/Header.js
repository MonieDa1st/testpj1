import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/furfly.png';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#53382c] p-4 flex justify-between items-center fixed w-full top-0 z-50">
      <div className="flex items-center ml-8">
        <img src={logo} alt="Furfly Blog Logo" className="h-12 w-12 mr-4 rounded-full" />
        <Link to="/" className="text-white text-3xl font-serif italic">furfly.blog</Link>
      </div>
      <div className="flex gap-4 mr-8">
        {user ? (
          <>
            <button
              onClick={() => navigate('/myblogs')}
              className="mr-8 text-xl font-semibold text-[#f4f1eb] hover:underline"
            >
              MY BLOGS
            </button>
            <button
              onClick={onLogout}
              className="text-xl font-semibold text-[#f4f1eb] hover:underline"
            >
              LOG OUT
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-8 text-xl font-semibold text-[#f4f1eb] hover:underline">
              LOGIN
            </Link>
            <Link to="/signup" className="text-xl font-semibold text-[#f4f1eb] hover:underline">
              SIGN UP
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header; 