const mongoose = require('mongoose');
const artist_schema = require('./ArtistModel').schema;
const jwt = require('jsonwebtoken');

const user_schema = mongoose.Schema({
  name: { type: String, required: true },
  spotify_link: { type: String, required: true },
  spotify_id: { type: String, required: true },
  image: { type: String, required: true },
  api_link: { type: String, required: true },
  role: { type: String, enum: [ 'user', 'admin' ], default: 'user' },
  followed_artists: [ { type : mongoose.Schema.ObjectId, ref : 'Artist'} ],
  email: {
    email_address: { type: String, default: null },
    in_use: { type: Boolean, default: false }
  },
  phone: {
    phone_number: { type: String, default: null },
    in_use: { type: Boolean, default: false }
  }
}, { versionKey: false } );

user_schema.methods.generate_jwt = function() {
  const is_admin = this.role === 'admin';
  const token = jwt.sign({ _id: this._id, is_admin }, process.env.JWT_SECRET);
  return token;
}

module.exports = mongoose.model('User', user_schema);
module.exports.schema = user_schema;
