// src/pages/Watch.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiDownload, FiPlay, FiClock } from 'react-icons/fi';
import api from '../services/api';

const Watch = () => {
  const { animeId, seasonNumber, episodeNumber } = useParams();
  const navigate = useNavigate();
  const [episodeData, setEpisodeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEpisode();
  }, [animeId, seasonNumber, episodeNumber]);

  const fetchEpisode = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/episodes/${animeId}/season/${seasonNumber}/episode/${episodeNumber}`
      );
      setEpisodeData(response.data);
    } catch (error) {
      console.error('Error fetching episode:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEpisodeChange = (episode) => {
    if (episode) {
      navigate(
        `/anime/${animeId}/season/${seasonNumber}/episode/${episode.episodeNumber}`
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white mt-4">Loading episode...</p>
        </div>
      </div>
    );
  }

  if (!episodeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Episode not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-300">
      {/* Video Player Section */}
      <div className="bg-dark-200">
        <div className="container mx-auto px-4 py-6">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <div
              dangerouslySetInnerHTML={{ __html: episodeData.embedLink }}
              className="w-full h-full"
            />
          </div>

          {/* Episode Info */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                {episodeData.anime?.title}
              </h1>
              <p className="text-gray-400">
                Season {episodeData.season?.seasonNumber} • Episode {episodeData.episodeNumber}: {episodeData.title}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {episodeData.downloadLink && (
                <a
                  href={episodeData.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-lg hover:bg-accent/30 transition-colors duration-200"
                >
                  <FiDownload />
                  <span>Download</span>
                </a>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-4 gap-3">
            <button
              onClick={() => handleEpisodeChange(episodeData.prevEpisode)}
              disabled={!episodeData.prevEpisode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                episodeData.prevEpisode
                  ? 'bg-dark-100 text-white hover:bg-primary/20'
                  : 'bg-dark-100 text-gray-600 cursor-not-allowed'
              }`}
            >
              <FiChevronLeft />
              <span>Previous</span>
            </button>
            <button
              onClick={() => handleEpisodeChange(episodeData.nextEpisode)}
              disabled={!episodeData.nextEpisode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                episodeData.nextEpisode
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-dark-100 text-gray-600 cursor-not-allowed'
              }`}
            >
              <span>Next</span>
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Episode Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-lg font-semibold text-white mb-4">All Episodes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {episodeData.allEpisodes?.map((episode) => (
            <button
              key={episode._id}
              onClick={() => handleEpisodeChange(episode)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                episode.episodeNumber === episodeData.episodeNumber
                  ? 'bg-primary/20 border border-primary'
                  : 'bg-dark-200 hover:bg-dark-100 border border-gray-800'
              }`}
            >
              <img
                src={episode.thumbnail}
                alt={episode.title}
                className="w-16 h-12 object-cover rounded"
              />
              <div className="text-left flex-1">
                <p className={`text-sm font-medium ${
                  episode.episodeNumber === episodeData.episodeNumber
                    ? 'text-primary'
                    : 'text-white'
                }`}>
                  Episode {episode.episodeNumber}
                </p>
                <p className="text-xs text-gray-400 line-clamp-1">{episode.title}</p>
              </div>
              {episode.episodeNumber === episodeData.episodeNumber && (
                <FiPlay className="text-primary" size={16} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watch;