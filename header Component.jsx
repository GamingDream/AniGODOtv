// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMenu, FiX, FiHome, FiFilm, FiTag, FiTrendingUp, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);
  const { admin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(async () => {
        try {
          setIsSearching(true);
          const response = await api.get(`/anime?search=${searchQuery}&limit=5`);
          setSearchResults(response.data.anime);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/anime-list', label: 'Anime', icon: FiFilm },
    { path: '/categories', label: 'Categories', icon: FiTag },
    { path: '/trending', label: 'Trending', icon: FiTrendingUp },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-200/95 backdrop-blur-lg border-b border-primary/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AnimeStream
            </span>
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              Hindi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anime..."
                  className="w-full bg-dark-100/50 text-white placeholder-gray-400 rounded-lg py-2 pl-10 pr-4 border border-gray-700 focus:border-primary focus:outline-none transition-colors duration-200"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </form>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-dark-200 rounded-lg shadow-xl border border-gray-700 overflow-hidden"
                >
                  {searchResults.map((anime) => (
                    <Link
                      key={anime._id}
                      to={`/anime/${anime.slug}`}
                      className="flex items-center space-x-3 p-3 hover:bg-dark-100 transition-colors duration-200"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                    >
                      <img
                        src={anime.poster}
                        alt={anime.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="text-white font-medium">{anime.title}</h4>
                        <p className="text-gray-400 text-sm">{anime.genres.join(', ')}</p>
                      </div>
                    </Link>
                  ))}
                  <div className="p-2 border-t border-gray-700">
                    <button
                      onClick={handleSearch}
                      className="w-full text-center text-primary hover:text-primary-light text-sm font-medium"
                    >
                      View all results
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Admin/Login Button */}
          <div className="hidden md:flex items-center space-x-4">
            {admin ? (
              <Link
                to="/admin"
                className="flex items-center space-x-2 bg-primary/20 text-primary px-4 py-2 rounded-lg hover:bg-primary/30 transition-colors duration-200"
              >
                <span>Admin</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200"
              >
                <FiLogIn />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-dark-100 rounded-lg transition-colors duration-200"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-dark-100 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <link.icon size={20} />
                    <span>{link.label}</span>
                  </Link>
                ))}
                <div className="pt-2 border-t border-gray-700">
                  {admin ? (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-3 text-primary px-3 py-2 rounded-lg hover:bg-dark-100 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FiLogIn size={20} />
                      <span>Admin Dashboard</span>
                    </Link>
                  ) : (
                    <Link
                      to="/admin/login"
                      className="flex items-center space-x-3 text-primary px-3 py-2 rounded-lg hover:bg-dark-100 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FiLogIn size={20} />
                      <span>Admin Login</span>
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;