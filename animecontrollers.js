const Anime = require('../models/Anime');
const Season = require('../models/Season');
const Episode = require('../models/Episode');
const Category = require('../models/Category');

exports.getAllAnime = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, genre, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { alternativeTitles: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.categories = category;
    }

    if (genre) {
      query.genres = genre;
    }

    if (status) {
      query.status = status;
    }

    const anime = await Anime.find(query)
      .populate('categories', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Anime.countDocuments(query);

    res.json({
      anime,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeaturedAnime = async (req, res) => {
  try {
    const featured = await Anime.find({ isFeatured: true })
      .populate('categories', 'name')
      .limit(10);
    res.json(featured);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTrendingAnime = async (req, res) => {
  try {
    const trending = await Anime.find({ isTrending: true })
      .populate('categories', 'name')
      .limit(10);
    res.json(trending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnimeById = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id)
      .populate('categories', 'name');
    
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    const seasons = await Season.find({ anime: anime._id })
      .sort({ seasonNumber: 1 });

    const seasonsWithEpisodes = await Promise.all(
      seasons.map(async (season) => {
        const episodes = await Episode.find({ season: season._id })
          .sort({ episodeNumber: 1 });
        return {
          ...season.toObject(),
          episodes
        };
      })
    );

    res.json({
      ...anime.toObject(),
      seasons: seasonsWithEpisodes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnimeBySlug = async (req, res) => {
  try {
    const anime = await Anime.findOne({ slug: req.params.slug })
      .populate('categories', 'name');
    
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    const seasons = await Season.find({ anime: anime._id })
      .sort({ seasonNumber: 1 });

    const seasonsWithEpisodes = await Promise.all(
      seasons.map(async (season) => {
        const episodes = await Episode.find({ season: season._id })
          .sort({ episodeNumber: 1 });
        return {
          ...season.toObject(),
          episodes
        };
      })
    );

    res.json({
      ...anime.toObject(),
      seasons: seasonsWithEpisodes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAnime = async (req, res) => {
  try {
    const animeData = req.body;
    
    // Handle categories
    if (animeData.categories) {
      const categoryIds = await Category.find({
        name: { $in: animeData.categories }
      }).select('_id');
      animeData.categories = categoryIds.map(c => c._id);
    }

    const anime = await Anime.create(animeData);
    res.status(201).json(anime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAnime = async (req, res) => {
  try {
    const anime = await Anime.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }
    
    res.json(anime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAnime = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    // Delete all seasons and episodes
    const seasons = await Season.find({ anime: anime._id });
    for (const season of seasons) {
      await Episode.deleteMany({ season: season._id });
    }
    await Season.deleteMany({ anime: anime._id });

    // Delete the anime
    await anime.deleteOne();

    res.json({ message: 'Anime deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecentAnime = async (req, res) => {
  try {
    const recent = await Anime.find({})
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(recent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};