import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      
      if (storedUser) {
        try {
          const response = await fetch(`http://localhost:5000/api/users/${storedUser.username}`);
          
          if (!response.ok) {
            // Nếu user không tồn tại trong database, xóa khỏi localStorage
            localStorage.removeItem('user');
            setUser(null);
          } else {
            // Nếu user tồn tại, cập nhật state
            const data = await response.json();
            setUser(data.user);
          }
        } catch (err) {
          console.error('Lỗi khi kiểm tra user:', err);
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, loading, login, logout };
};

export default useAuth; 