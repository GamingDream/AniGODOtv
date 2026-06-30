const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  alternativeTitles: [String],
  description: {
    type: String,
    required: true
  },
  banner: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  genres: [{
    type: String,
    required: true
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  releaseYear: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Completed', 'Upcoming'],
    default: 'Ongoing'
  },
  studio: {
    type: String,
    default: ''
  },
  totalSeasons: {
    type: Number,
    default: 0
  },
  totalEpisodes: {
    type: Number,
    default: 0
  },
  isHindiDubbed: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

animeSchema.pre('save', function(next) {
  this.slug = this.title.toLowerCase().replace(/ /g, '-');
  next();
});

module.exports = mongoose.model('Anime', animeSchema);