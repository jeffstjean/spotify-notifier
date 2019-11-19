const mongoose = require('mongoose');
const User = require('../models/user');
const Artist = require('../models/artist');
const request = require('request-promise');

module.exports.updateUserArtists = function(user_id, token) {
  return new Promise(async(resolve, reject) => {
    try {
      token = await updateAccessToken(token);
      var user = await User.findById(user_id)

      const spotifyArtists = await getSpotifyArtistList(token.access_token);
      const databaseArtists = user.artists;
      const artistsToAdd = getArtistsToAdd(spotifyArtists, databaseArtists);
      user = await addArtistsToUser(user, artistsToAdd).save();
      resolve({ user, token });
    } catch(e) {
      console.log(e);
      reject('ERROR');
    }
  });
}

const updateAccessToken = function(token) {
  return new Promise((resolve, reject) => {
    if((Date.now() - new Date(token.issued)) / 60000 < 50) resolve(token);
    else {
        console.log('Getting new token');
        const authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          headers: { 'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')) },
          form: {
            grant_type: 'refresh_token',
            refresh_token: token.refresh_token
          },
          json: true
        };

        request.post(authOptions, function(error, response, body) {
          if (!error && response.statusCode === 200) {
            token.access_token = body.access_token;
            token.issued = new Date();
            resolve(token);
          }
          else reject(body)
        });
    }
  });
}

const getSpotifyArtistList = function(access_token) {
  return new Promise(async(resolve, reject) => {
    var followingOptions = {
      url: 'https://api.spotify.com/v1/me/following?type=artist',
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    };
    let following = [];
    try {
      var chunkCount = 0;
      do {
        chunkCount++;
        var chunk = await request.get(followingOptions);
        followingOptions.url = chunk.artists.next
        chunk.artists.items.forEach(artist => {
          following.push(artist);
        });
      } while(chunk.artists.next != null);
      console.log(`Received ${chunkCount} chunks`);
      resolve(following);
    } catch(e) {
      reject(e)
    }
  });
}

const getArtistsToAdd = function(spotifyArtists, databaseArtists) {
  let artistsToAdd = [];
  spotifyArtists.forEach(spotifyArtist => {
    let artistAlreadyExists = false;
    databaseArtists.forEach(databaseArtist => {
      if(spotifyArtist.name === databaseArtist.name) artistAlreadyExists = true;
    });
    if(!artistAlreadyExists) artistsToAdd.push(spotifyArtist);
  });
  return artistsToAdd;
}

const addArtistsToUser = function(user, artistsToAdd) {
  var count = 0;
  artistsToAdd.forEach(artist => {
    const newArtist = new Artist({
      spotify_id: artist.id,
      image: artist.images[0].url,
      url: artist.external_urls.spotify,
      name: artist.name
    });
    user.artists.push(newArtist);
    count++;
  });
  console.log(`Added ${count} new artists`);
  return user;
}
