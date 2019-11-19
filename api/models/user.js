const mongoose = require('mongoose');
const Artist = require('../models/artist');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  spotify_id: { type: String, required: 'User must have an ID (from Spotify)' },
  display_name: { type: String, required: 'User must have a display name (from Spotify)' },
  url: { type: String, required: 'User must have a url (from Spotify)' },
  image: { type: String, required: 'User must have an image url (from Spotify)' },
  email_address: { type: String, required: 'User must have an email (from Spotify)' },
  email_in_use: { type: Boolean, default: true },
  phone_number: { type: Number },
  phone_in_use: { type: Boolean, default: false },
  token: { type: String, default: null },
  artists: { type: [Artist.schema], default: [] }
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id }, '1234');
}

module.exports = mongoose.model('User', userSchema);
