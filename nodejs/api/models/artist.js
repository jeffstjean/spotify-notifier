const mongoose = require('mongoose');
const validators = require('../validators');

const artistSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // place for a unique id
  spotify_data: {
    id: { type: String, required: 'Artist must have an ID (from spotify)' },
    image: { type: String, required: 'Artist must have an image (from spotify)', validate: [validators.validateURL, 'Please enter a valid image url'] } ,
    url: { type: String, required: 'Artist must have a url (from spotify)', validate: [validators.validateURL, 'Please enter a valid artist url'] },
    name: { type: String, required: 'Artist must have a name (from spotify)' }
  },
  receive_alerts: { type: Boolean, default: true },
  last_update: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Artist', artistSchema)
