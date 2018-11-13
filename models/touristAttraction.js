const mongoose = require('mongoose');

const TouristAttractionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  phone: {
    type: Number,
    required: true,
    trim: true,
  },
  activities: {
    type: [String],
    require: true,
    minlength: 1,
  },
  coordinates: {
    lat: {
      type: String,
      require: true,
    },
    lng: {
      type: String,
      require: true,
    },
  },
  images: {
    type: [String],
    require: true,
    minlength: 1,
  },
});

const TouristAttraction = mongoose.model(
  'tourist_attraction',
  TouristAttractionSchema,
);

module.exports = { TouristAttraction };
