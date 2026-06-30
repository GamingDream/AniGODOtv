const Episode = require('../models/Episode');
const Season = require('../models/Season');
const Anime = require('../models/Anime');

exports.getEpisodeById = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id)
      .populate('season')
      .populate('anime');
    
    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    // Increment views
    episode.views += 1;
    await episode.save();

    res.json(episode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEpisodeByAnimeAndSeason = async (req, res) => {
  try {
    const { animeId, seasonNumber, episodeNumber } = req.params;
    
    const anime = await Anime.findOne({ slug: animeId });
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    const season = await Season.findOne({ 
      anime: anime._id, 
      seasonNumber: parseInt(seasonNumber) 
    });
    
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }

    const episode = await Episode.findOne({
      season: season._id,
      episodeNumber: parseInt(episodeNumber)
    }).populate('season').populate('anime');

    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    // Increment views
    episode.views += 1;
    await episode.save();

    // Get all episodes for sidebar
    const allEpisodes = await Episode.find({ season: season._id })
      .sort({ episodeNumber: 1 });

    // Get next and previous episodes
    const episodeIndex = allEpisodes.findIndex(e => e._id.toString() === episode._id.toString());
    const prevEpisode = episodeIndex > 0 ? allEpisodes[episodeIndex - 1] : null;
    const nextEpisode = episodeIndex < allEpisodes.length - 1 ? allEpisodes[episodeIndex + 1] : null;

    res.json({
      ...episode.toObject(),
      allEpisodes,
      prevEpisode,
      nextEpisode
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEpisode = async (req, res) => {
  try {
    const episodeData = req.body;
    
    // Validate season exists
    const season = await Season.findById(episodeData.season);
    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }

    const episode = await Episode.create(episodeData);
    
    // Update season episode count
    season.episodeCount += 1;
    await season.save();

    // Update anime total episodes
    const anime = await Anime.findById(season.anime);
    anime.totalEpisodes += 1;
    await anime.save();

    res.status(201).json(episode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEpisode = async (req, res) => {
  try {
    const episode = await Episode.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }
    
    res.json(episode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEpisode = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    const season = await Season.findById(episode.season);
    if (season) {
      season.episodeCount -= 1;
      await season.save();

      const anime = await Anime.findById(season.anime);
      if (anime) {
        anime.totalEpisodes -= 1;
        await anime.save();
      }
    }

    await episode.deleteOne();
    res.json({ message: 'Episode deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLatestEpisodes = async (req, res) => {
  try {
    const episodes = await Episode.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('anime', 'title slug poster')
      .populate('season', 'seasonNumber');
    
    res.json(episodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};