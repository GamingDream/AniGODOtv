// src/pages/AnimeDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiStar, FiCalendar, FiInfo, FiClock, FiDownload } from 'react-icons/fi';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import api from '../services/api';

const AnimeDetails = () => {
  const { slug } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSeasons, setExpandedSeasons] = useState({});

  useEffect(() => {
    fetchAnimeDetails();
  }, [slug]);

  const fetchAnimeDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/anime/slug/${slug}`);
      setAnime(response.data);
      
      // Auto-expand first season
      if (response.data.seasons?.length > 0) {
        setExpandedSeasons({ [response.data.seasons[0]._id]: true });
      }
    } catch (error) {
      console.error('Error fetching anime details:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeason = (seasonId) => {
    setExpandedSeasons(prev => ({
      ...prev,
      [seasonId]: !prev[seasonId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white mt-4">Loading anime details...</p>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Anime not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-[60vh] md:h-[70vh]">
        <img
          src={anime.banner}
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-300 via-dark-300/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-12">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-48 md:w-64 rounded-lg shadow-2xl shadow-primary/20 border-2 border-primary/20"
                />
                <div className="flex-1">
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                    {anime.title}
                  </h1>
                  {anime.alternativeTitles?.length > 0 && (
                    <p className="text-gray-400 text-sm mb-3">
                      Also known as: {anime.alternativeTitles.join(', ')}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {anime.genres?.map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                    {anime.isHindiDubbed && (
                      <span className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full">
                        Hindi Dubbed
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <FiStar className="text-yellow-400 fill-current" />
                      {anime.rating?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar />
                      {anime.releaseYear}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiInfo />
                      {anime.status}
                    </span>
                    <span>{anime.totalSeasons} Season{anime.totalSeasons !== 1 ? 's' : ''}</span>
                    <span>{anime.totalEpisodes} Episodes</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to={`/anime/${anime.slug}/season/${anime.seasons?.[0]?.seasonNumber || 1}/episode/1`}
                      className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200"
                    >
                      <FiPlay />
                      <span>Start Watching</span>
                    </Link>
                    {anime.studio && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <span>Studio: {anime.studio}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-white mb-2">Description</h2>
          <p className="text-gray-300 leading-relaxed">{anime.description}</p>
        </motion.div>

        {/* Seasons and Episodes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10"
        >
          <h2 className="text-xl font-bold text-white mb-4">Seasons & Episodes</h2>
          <div className="space-y-4">
            {anime.seasons?.map((season) => (
              <div
                key={season._id}
                className="bg-dark-200 rounded-lg overflow-hidden border border-gray-800"
              >
                <button
                  onClick={() => toggleSeason(season._id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-dark-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-semibold">
                      {season.seasonName || `Season ${season.seasonNumber}`}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {season.episodeCount} Episodes
                    </span>
                  </div>
                  {expandedSeasons[season._id] ? (
                    <FaChevronUp className="text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </button>
                
                {expandedSeasons[season._id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 pt-0"
                  >
                    <div className="grid gap-3">
                      {season.episodes?.map((episode) => (
                        <Link
                          key={episode._id}
                          to={`/anime/${anime.slug}/season/${season.seasonNumber}/episode/${episode.episodeNumber}`}
                          className="flex items-center space-x-4 p-3 bg-dark-100 rounded-lg hover:bg-primary/10 transition-colors duration-200 group"
                        >
                          <img
                            src={episode.thumbnail}
                            alt={episode.title}
                            className="w-32 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-medium group-hover:text-primary transition-colors duration-200">
                              Episode {episode.episodeNumber}: {episode.title}
                            </h4>
                            <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                              <span className="flex items-center gap-1">
                                <FiClock size={12} />
                                {episode.duration}
                              </span>
                              {episode.downloadLink && (
                                <a
                                  href={episode.downloadLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-accent hover:text-accent-light transition-colors duration-200"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FiDownload size={12} />
                                  Download
                                </a>
                              )}
                            </div>
                          </div>
                          <button className="p-2 bg-primary/20 text-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <FiPlay size={16} />
                          </button>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimeDetails;