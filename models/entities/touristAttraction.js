const mongoose = require('mongoose');
const Joi = require('joi');

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
    required: true,
    minlength: 1,
  },
  lat: {
    type: String,
    required: true,
  },
  lng: {
    type: String,
    required: true,
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

function validateTouristAttraction(data) {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    phone: Joi.number()
      .integer()
      .required(),
    activities: Joi.array()
      .items(Joi.string().required())
      .min(1),
    lat: Joi.string().required(),
    lng: Joi.string().required(),
    images: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.string().required(),
          url: Joi.string().required(),
        }),
      )
      .min(1),
  });

  return Joi.validate(data, schema);
}

module.exports = { TouristAttraction, validateTouristAttraction };
