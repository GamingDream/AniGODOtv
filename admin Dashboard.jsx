// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiFilm,
  FiLayers,
  FiVideo,
  FiTag,
  FiTrendingUp,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAnime, setRecentAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, recentRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/anime/recent')
      ]);
      setStats(statsRes.data);
      setRecentAnime(recentRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Anime',
      value: stats?.totalAnime || 0,
      icon: FiFilm,
      color: 'from-primary to-primary-dark',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Total Seasons',
      value: stats?.totalSeasons || 0,
      icon: FiLayers,
      color: 'from-secondary to-secondary-dark',
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'Total Episodes',
      value: stats?.totalEpisodes || 0,
      icon: FiVideo,
      color: 'from-accent to-accent-dark',
      change: '+15%',
      trend: 'up',
    },
    {
      title: 'Categories',
      value: stats?.totalCategories || 0,
      icon: FiTag,
      color: 'from-yellow-400 to-yellow-600',
      change: '+5%',
      trend: 'up',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your anime platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-dark-200 rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium flex items-center ${
                    stat.trend === 'up' ? 'text-accent' : 'text-red-500'
                  }`}>
                    {stat.trend === 'up' ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Anime */}
        <div className="bg-dark-200 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Recently Added Anime</h3>
          <div className="space-y-3">
            {recentAnime.slice(0, 5).map((anime) => (
              <Link
                key={anime._id}
                to={`/admin/anime/edit/${anime._id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-100 transition-colors duration-200"
              >
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{anime.title}</p>
                  <p className="text-gray-400 text-sm">{anime.genres?.join(', ')}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(anime.createdAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-dark-200 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/anime/create"
              className="p-4 bg-dark-100 rounded-lg hover:bg-primary/10 transition-colors duration-200 text-center"
            >
              <FiFilm className="text-primary text-2xl mx-auto mb-2" />
              <span className="text-white text-sm">Add Anime</span>
            </Link>
            <Link
              to="/admin/categories"
              className="p-4 bg-dark-100 rounded-lg hover:bg-primary/10 transition-colors duration-200 text-center"
            >
              <FiTag className="text-secondary text-2xl mx-auto mb-2" />
              <span className="text-white text-sm">Manage Categories</span>
            </Link>
            <Link
              to="/admin/slider"
              className="p-4 bg-dark-100 rounded-lg hover:bg-primary/10 transition-colors duration-200 text-center"
            >
              <FiTrendingUp className="text-accent text-2xl mx-auto mb-2" />
              <span className="text-white text-sm">Manage Slider</span>
            </Link>
            <Link
              to="/admin/anime"
              className="p-4 bg-dark-100 rounded-lg hover:bg-primary/10 transition-colors duration-200 text-center"
            >
              <FiCalendar className="text-yellow-400 text-2xl mx-auto mb-2" />
              <span className="text-white text-sm">View All Anime</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;