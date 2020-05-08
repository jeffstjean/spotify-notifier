const mongoose = require('mongoose');

const artist_schema = mongoose.Schema({
  name: { type: String, required: true },
  spotify_link: { type: String, required: true },
  spotify_id: { type: String, required: true },
  image: { type: String, required: true },
  api_link: { type: String, required: true },
  following_users: [ { type : mongoose.Schema.Types.ObjectId, ref : 'User' } ],
  most_recent: {
    name: { type: String, required: true },
    type: { type: String, required: true },
    spotify_link: { type: String, required: true },
    api_link: { type: String, required: true },
    spotify_id: { type: String, required: true },
    image: { type: String, required: true },
    date_retrieved: { type: Date, default: Date.now },
  }
}, { versionKey: false } );

module.exports = mongoose.model('Artist', artist_schema);
