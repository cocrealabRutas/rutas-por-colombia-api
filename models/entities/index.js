const {
  TouristAttraction,
  validateTouristAttraction,
} = require('./touristAttraction');

const entities = {
  touristAttraction: {
    Schema: TouristAttraction,
    validate: validateTouristAttraction,
  },
};

module.exports = entities;
