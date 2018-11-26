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
  images: [
    {
      id: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      },
      url: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
});

const TouristAttraction = mongoose.model(
  'TouristAttraction',
  TouristAttractionSchema,
);

module.exports = { TouristAttraction };
