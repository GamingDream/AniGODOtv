// src/pages/admin/AnimeManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiFilm,
  FiStar,
  FiClock,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AnimeManagement = () => {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchAnime();
  }, [search, filter]);

  const fetchAnime = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/anime?search=${search}&status=${filter}`);
      setAnime(response.data.anime);
    } catch (error) {
      console.error('Error fetching anime:', error);
      toast.error('Failed to load anime');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this anime? This will also delete all seasons and episodes.')) {
      return;
    }

    try {
      await api.delete(`/anime/${id}`);
      toast.success('Anime deleted successfully');
      fetchAnime();
    } catch (error) {
      console.error('Error deleting anime:', error);
      toast.error('Failed to delete anime');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Anime Management</h1>
          <p className="text-gray-400">Manage all anime content on your platform</p>
        </div>
        <Link
          to="/admin/anime/create"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200"
        >
          <FiPlus />
          <span>Add New Anime</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anime..."
            className="w-full bg-dark-200 text-white placeholder-gray-400 rounded-lg py-2 pl-10 pr-4 border border-gray-700 focus:border-primary focus:outline-none transition-colors duration-200"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-dark-200 text-white rounded-lg py-2 px-4 border border-gray-700 focus:border-primary focus:outline-none transition-colors duration-200"
        >
          <option value="">All Status</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Upcoming">Upcoming</option>
        </select>
      </div>

      {/* Anime Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {anime.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-200 rounded-xl overflow-hidden border border-gray-800 hover:border-primary/30 transition-all duration-300"
          >
            <div className="relative aspect-[16/9]">
              <img
                src={item.banner}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {item.isFeatured && (
                  <span className="bg-primary/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
                {item.isTrending && (
                  <span className="bg-secondary/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    Trending
                  </span>
                )}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold line-clamp-1">{item.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                <span className="flex items-center gap-1">
                  <FiStar className="text-yellow-400" />
                  {item.rating?.toFixed(1) || 'N/A'}
                </span>
                <span>{item.releaseYear}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  item.status === 'Ongoing' ? 'bg-accent/20 text-accent' :
                  item.status === 'Completed' ? 'bg-primary/20 text-primary' :
                  'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-gray-400 text-sm">
                  {item.totalSeasons} Season{item.totalSeasons !== 1 ? 's' : ''}
                </span>
                <span className="text-gray-400 text-sm">
                  {item.totalEpisodes} Episodes
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Link
                  to={`/admin/anime/edit/${item._id}`}
                  className="flex-1 flex items-center justify-center gap-1 bg-primary/20 text-primary py-2 rounded-lg hover:bg-primary/30 transition-colors duration-200"
                >
                  <FiEdit size={16} />
                  <span>Edit</span>
                </Link>
                <Link
                  to={`/admin/seasons/${item._id}`}
                  className="flex-1 flex items-center justify-center gap-1 bg-secondary/20 text-secondary py-2 rounded-lg hover:bg-secondary/30 transition-colors duration-200"
                >
                  <FiClock size={16} />
                  <span>Seasons</span>
                </Link>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex items-center justify-center w-10 h-10 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {anime.length === 0 && (
        <div className="text-center py-12">
          <FiFilm className="text-gray-600 text-6xl mx-auto mb-4" />
          <h3 className="text-xl text-white font-semibold">No Anime Found</h3>
          <p className="text-gray-400">Start by adding your first anime</p>
          <Link
            to="/admin/anime/create"
            className="inline-block mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200"
          >
            Add Anime
          </Link>
        </div>
      )}
    </div>
  );
};

export default AnimeManagement;