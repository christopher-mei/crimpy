// src/components/Dashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface DashboardProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome, {user?.username || 'User'}!</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
          {/* Add your dashboard content here */}
          <p>Your dashboard content goes here...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;