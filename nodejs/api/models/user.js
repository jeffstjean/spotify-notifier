const mongoose = require('mongoose');
const validators = require('../validators');
const Artist = require('../models/artist');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // place for a unique id
  spotify_data: {
    id: { type: String, required: 'User must have an ID (from Spotify)' },
    display_name: { type: String, required: 'User must have a display name (from Spotify)' },
    url: { type: String, required: 'User must have a url (from Spotify)', validate: [validators.validateURL, 'Please enter a valid user url'] },
    image: { type: String, required: 'User must have an image url (from Spotify)', validate: [validators.validateURL, 'Please enter a valid image url'] }
  },
  contact_info: {
    email: {
      email_address: { type: String, required: 'User must have an email (from Spotify)', validate: [validators.validateEmailAddress, 'Please enter a valid email address'] },
      in_use: { type: Boolean, default: true }
    },
    phone: {
      phone_number: { type: Number, validate: [validators.validatePhoneNumber, 'Please enter a valid phone number'] },
      in_use: { type: Boolean, default: false }
    }
  },
  artists: [Artist.schema]
});

module.exports = mongoose.model('User', userSchema);
