// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import AnimeDetails from './pages/AnimeDetails';
import Watch from './pages/Watch';
import AnimeList from './pages/AnimeList';
import Categories from './pages/Categories';
import Search from './pages/Search';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAnime from './pages/admin/AnimeManagement';
import AdminAnimeCreate from './pages/admin/AnimeCreate';
import AdminAnimeEdit from './pages/admin/AnimeEdit';
import AdminSeasons from './pages/admin/SeasonManagement';
import AdminEpisodes from './pages/admin/EpisodeManagement';
import AdminCategories from './pages/admin/CategoryManagement';
import AdminSlider from './pages/admin/SliderManagement';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#111111',
                color: '#fff',
                border: '1px solid #8B5CF6',
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="anime/:slug" element={<AnimeDetails />} />
              <Route path="anime/:animeId/season/:seasonNumber/episode/:episodeNumber" element={<Watch />} />
              <Route path="anime-list" element={<AnimeList />} />
              <Route path="categories" element={<Categories />} />
              <Route path="search" element={<Search />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path="anime" element={<AdminAnime />} />
              <Route path="anime/create" element={<AdminAnimeCreate />} />
              <Route path="anime/edit/:id" element={<AdminAnimeEdit />} />
              <Route path="seasons/:animeId" element={<AdminSeasons />} />
              <Route path="episodes/:seasonId" element={<AdminEpisodes />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="slider" element={<AdminSlider />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;