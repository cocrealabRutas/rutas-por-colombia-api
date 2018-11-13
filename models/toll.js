const mongoose = require('mongoose');

const TollSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  state: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  prices: {
    type: [Number],
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
  phone: {
    type: Number,
  },
  towTruck: {
    type: Number,
  },
});

const Toll = mongoose.model('Toll', TollSchema);

module.exports = { Toll };
