import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserFriends, FaListUl } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    agents: 0,
    batches: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch agents count
        const agentsResponse = await axios.get('/api/agents');
        
        // Fetch batches count
        const batchesResponse = await axios.get('/api/lists/batches');
        
        setStats({
          agents: agentsResponse.data.count || 0,
          batches: batchesResponse.data.count || 0
        });
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-secondary-800">Dashboard</h1>
        <p className="text-secondary-500">Welcome to the Distributo admin panel</p>
      </div>

      {error && (
        <div className="mb-6">
          <div className="alert alert-danger">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-danger-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="ml-auto text-danger-500 hover:text-danger-600 focus:outline-none"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/agents" className="block group">
          <div className="card h-full transition-all duration-200 hover:shadow-card-hover">
            <div className="card-body flex items-center p-6">
              <div className="bg-primary-100 p-3 rounded-full mr-4 group-hover:bg-primary-200 transition-colors duration-200">
                <FaUserFriends className="text-2xl text-primary-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-0">{stats.agents}</h3>
                <div className="text-secondary-500">Agents</div>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/lists" className="block group">
          <div className="card h-full transition-all duration-200 hover:shadow-card-hover">
            <div className="card-body flex items-center p-6">
              <div className="bg-success-100 p-3 rounded-full mr-4 group-hover:bg-success-200 transition-colors duration-200">
                <FaListUl className="text-2xl text-success-500" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-0">{stats.batches}</h3>
                <div className="text-secondary-500">List Batches</div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-8">
        <div className="card">
          <div className="card-body">
            <h5 className="text-lg font-medium text-secondary-800 mb-4">Quick Actions</h5>
            <div className="flex flex-wrap gap-3">
              <Link to="/agents" className="btn btn-outline-primary">
                Manage Agents
              </Link>
              <Link to="/lists" className="btn btn-success">
                Upload & Distribute Lists
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 