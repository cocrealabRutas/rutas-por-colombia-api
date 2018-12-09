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
      path: {
        type: String,
        required: true,
        trim: true,
      },
      key: {
        type: String,
        required: true,
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
      .min(1)
      .required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    images: Joi.array()
      .items(
        Joi.object().keys({
          path: Joi.string().required(),
          key: Joi.string().required(),
        }),
      )
      .min(1),
  });

  return Joi.validate(data, schema);
}

module.exports = { TouristAttraction, validateTouristAttraction };
