import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [username, setUsername] = useState('Guest');
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    setLoading(false);
  }, []);

  const userImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Generic_avatar.png/456px-Generic_avatar.png";

  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
};


  return (
    <div className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2 text-white">
        <img src={userImage} alt="User Avatar" className="w-8 h-8 rounded-full" />
        {loading ? (
          <span>Loading...</span>
        ) : error ? (
          <span>{error}</span>
        ) : (
          <span className="text-lg font-semibold">{username}</span>
        )}
      </div>
      <div>
        <Link to="/mainpage" className="text-white ml-4 hover:underline">Main Page</Link>
        <Link to="/request" className="text-white ml-4 hover:underline">Requests</Link>
        <Link to="/login" className="text-white ml-4 hover:underline" onClick={handleLogout}>Logout</Link>
      </div>
    </div>
  );
};

export default Navbar;