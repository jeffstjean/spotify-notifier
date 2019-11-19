const db = require('mongodb');
const User = require('../models/user');
const request = require('request-promise');
const name = 'update user artists'
module.exports.name = name;

module.exports.function = async function(job, done) {
    console.log(`Running '${name}' job`)
    let token = await getNewToken();
    const users = await User.find({});
    users.forEach(async user => {
      if(isTokenExpired(token)) token = await getNewToken();
      user.artists.forEach(async artist => {
        const newestAlbum = await getNewestAlbum(token, artist);
        if(newestAlbum.name === 'ZOO') newestAlbum.release_date = new Date(Date.now() + 1000);
        if(new Date(newestAlbum.release_date) > artist.last_update) {
          console.log(`New release from ${artist.name}: ${newestAlbum.name}`);
          artist.last_update = Date.now();
          await user.save();
        }
      });
    })
}

const isTokenExpired = function(token) {
 return token.expiry - new Date() < 20;
}

const getNewToken = async function(){
  console.log('Getting new token...')
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };
  let token = await request.post(authOptions);
  token.expiry = new Date(Date.now() + token.expires_in);
  return token;
}


const getNewestAlbum = async function(token, artist) {
  var options = {
    url: 'https://api.spotify.com/v1/artists/' + artist.spotify_id + '/albums?limit=1',
    headers: {
      'Authorization': 'Bearer ' + token.access_token
    },
    json: true
  };
  const result = await request.get(options);
  return result.items[0]
}
