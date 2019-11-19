const mongoose = require('mongoose');

const artistSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // place for a unique id
  spotify_id: { type: String, required: 'Artist must have an ID (from spotify)' },
  image: { type: String, required: 'Artist must have an image (from spotify)' } ,
  url: { type: String, required: 'Artist must have a url (from spotify)' },
  name: { type: String, required: 'Artist must have a name (from spotify)' },
  last_update: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Artist', artistSchema)
