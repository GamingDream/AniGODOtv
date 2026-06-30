// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { FiPlay, FiInfo, FiStar, FiClock } from 'react-icons/fi';
import api from '../services/api';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home = () => {
  const [sliderAnime, setSliderAnime] = useState([]);
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [latestEpisodes, setLatestEpisodes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentAnime, setRecentAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [sliderRes, trendingRes, episodesRes, categoriesRes, recentRes] = await Promise.all([
        api.get('/slider'),
        api.get('/anime/trending'),
        api.get('/episodes/latest'),
        api.get('/categories'),
        api.get('/anime/recent')
      ]);

      setSliderAnime(sliderRes.data);
      setTrendingAnime(trendingRes.data);
      setLatestEpisodes(episodesRes.data);
      setCategories(categoriesRes.data);
      setRecentAnime(recentRes.data);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const AnimeCard = ({ anime, variant = 'grid' }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative rounded-lg overflow-hidden bg-dark-200 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
    >
      <Link to={`/anime/${anime.slug}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={anime.poster}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-transparent to-transparent opacity-60" />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-dark-300/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
            <FiStar className="text-yellow-400 fill-current" size={12} />
            <span className="text-white text-xs font-medium">{anime.rating?.toFixed(1) || 'N/A'}</span>
          </div>

          {/* Hindi Badge */}
          {anime.isHindiDubbed && (
            <div className="absolute top-2 left-2 bg-primary/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <span className="text-white text-xs font-medium">Hindi</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-dark-300/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="bg-primary text-white p-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <FiPlay size={24} />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {anime.title}
          </h3>
          <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
            <span>{anime.totalSeasons || 0} Season{anime.totalSeasons !== 1 ? 's' : ''}</span>
            <span>{anime.totalEpisodes || 0} Episodes</span>
          </div>
          {variant === 'grid' && (
            <div className="flex flex-wrap gap-1 mt-2">
              {anime.genres?.slice(0, 2).map((genre, index) => (
                <span key={index} className="text-[10px] px-1.5 py-0.5 bg-dark-100 text-gray-300 rounded">
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );

  const EpisodeCard = ({ episode }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-dark-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
    >
      <Link to={`/anime/${episode.anime?.slug}/season/${episode.season?.seasonNumber}/episode/${episode.episodeNumber}`}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={episode.thumbnail}
            alt={episode.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-transparent to-transparent opacity-60" />
          <div className="absolute top-2 right-2 bg-dark-300/80 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-white text-xs font-medium">Episode {episode.episodeNumber}</span>
          </div>
          <div className="absolute bottom-2 left-2 bg-primary/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <span className="text-white text-xs font-medium">Hindi</span>
          </div>
        </div>
        <div className="p-3">
          <h4 className="text-white font-medium text-sm line-clamp-1">{episode.title}</h4>
          <p className="text-gray-400 text-xs mt-1">{episode.anime?.title}</p>
        </div>
      </Link>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white mt-4">Loading anime...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-8 !h-1 !rounded-none',
            bulletActiveClass: '!bg-primary',
          }}
          navigation
          loop
          className="h-[80vh] md:h-[90vh]"
        >
          {sliderAnime.map((item) => (
            <SwiperSlide key={item._id}>
              <div className="relative w-full h-full">
                <img
                  src={item.anime?.banner}
                  alt={item.anime?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-300 via-dark-300/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-transparent to-transparent" />
                
                <div className="absolute bottom-20 left-0 right-0 px-4 md:px-12 max-w-4xl">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                      {item.anime?.title}
                    </h1>
                    <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-3 max-w-2xl">
                      {item.anime?.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/anime/${item.anime?.slug}`}
                        className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200"
                      >
                        <FiPlay />
                        <span>Watch Now</span>
                      </Link>
                      <Link
                        to={`/anime/${item.anime?.slug}`}
                        className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors duration-200"
                      >
                        <FiInfo />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Trending Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FiTrendingUp className="text-primary mr-2" />
              Trending Now
            </h2>
            <Link to="/trending" className="text-primary hover:text-primary-light text-sm font-medium transition-colors duration-200">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {trendingAnime.slice(0, 6).map((anime) => (
              <AnimeCard key={anime._id} anime={anime} variant="trending" />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Latest Episodes */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Latest Episodes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {latestEpisodes.slice(0, 10).map((episode) => (
              <EpisodeCard key={episode._id} episode={episode} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/categories?category=${category.slug}`}
                className="px-4 py-2 bg-dark-200 text-gray-300 rounded-full hover:bg-primary/20 hover:text-white transition-all duration-200 border border-gray-700 hover:border-primary"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Recent Anime Grid */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Recently Added</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recentAnime.map((anime) => (
              <AnimeCard key={anime._id} anime={anime} variant="grid" />
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;