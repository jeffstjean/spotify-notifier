const Artist = require('../models/ArtistModel');
const User = require('../models/UserModel');
const spotify_tools = require('../tools/SpotifyTools');
const { send_email } = require('../jobs/SendEmail')
const { send_text } = require('../jobs/SendText')

module.exports.update_artists = async function() {
  var artists = await Artist.find({});
  console.log(`updating ${artists.length} artists...`)
  artists.forEach(async artist => {
    var most_recent = await spotify_tools.get_recent_album(artist.spotify_id);

    if(most_recent.spotify_id !== artist.most_recent.spotify_id) {
      console.log(`New album from ${artist.name}: ${most_recent.name}`);
      artist.most_recent = most_recent;
      const users_to_notify = (await Artist.findById(artist._id).populate('following_users').exec()).following_users;
      users_to_notify.forEach(user => {
        console.log(`Updating going out to ${user.name}`);
        if(user.phone.in_use) {
          send_text(artist, user);
        }
        if(user.email.in_use) {
          send_email(artist, user);
        }
      })
    }
    artist.most_recent.date_retrieved = Date.now();
    await artist.save();
  })
}
