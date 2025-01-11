import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MainPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found, please log in');
      return;
    }

    axios
      .get('https://tutedude-ray7.onrender.com/friends/home', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data.allUsers || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load data');
      });
  }, []);

  return (
    <div className="container max-w-3xl px-4 mx-auto sm:px-8">
      <div className="py-8">
        <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
          <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200">
                      Username
                    </th>
                    <th className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200">
                      Friends Count
                    </th>
                    <th className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200">
                      Interests
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">{user.username}</p>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">{user.friends.length}</p>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">{user.interests.join(', ')}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;