const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  imageUrl: { type: String, require: true },
  address: { type: String, require: true },
  creatorId: { type: mongoose.Types.ObjectId, require: true, ref: 'User' },
  location: {
    lat: { type: Number, require: true },
    lng: { type: Number, require: true },
  },
});

module.exports = mongoose.model('Place', placeSchema);
