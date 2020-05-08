const path = require('path');
const got = require('got');
const querystring = require('querystring');
const client_id = process.env.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_SECRET;
const DOMAIN = process.env.DOMAIN;
const PORT = process.env.NODE_PORT;
const redirect_uri = `${DOMAIN}:${PORT}/callback`;

module.exports.get_auth_url = function(state) {
  const scope = 'user-read-private user-read-email';
  return 'https://accounts.spotify.com/authorize?' + querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    });
}

module.exports.get_artist = async function(spotify_id) {
  try {
    const access_token = await s2s_authorize();
    const url = path.join('http://api.spotify.com/v1/artists/', spotify_id);
    const options = {
      headers: {'Authorization': 'Bearer ' + access_token }
    };
    const get = await got(url, options);
    const artist = JSON.parse(get.body);

    
    return artist;
  }
  catch(e) {
    console.log(e)
    return null;
  }
}

module.exports.spotify_artist_to_db = function(spotify_artist, recent_album) {
    var database_artist = {
      name: spotify_artist.name,
      spotify_link: spotify_artist.external_urls.spotify,
      spotify_id: spotify_artist.id,
      api_link: spotify_artist.href,
      most_recent: recent_album,
      following_users: []
    };

    if(spotify_artist.images[0]) database_artist.image = spotify_artist.images[0].url;
    else database_artist.image = 'https://www.pngkey.com/png/full/204-2049354_ic-account-box-48px-profile-picture-icon-square.png';
    
    return database_artist;
}

module.exports.spotify_user_to_db = function(spotify_user) {
  var database_user = {
    name: spotify_user.display_name,
    spotify_link: spotify_user.external_urls.spotify,
    spotify_id: spotify_user.id,
    api_link: spotify_user.href,
    followed_artists: [],
    email: {},
    phone: {}
  };

  if(spotify_user.images[0]) database_user.image = spotify_user.images[0].url;
  else database_user.image = 'https://www.pngkey.com/png/full/204-2049354_ic-account-box-48px-profile-picture-icon-square.png';
  if(spotify_user.email) {
    database_user.email.email_address = spotify_user.email;
    database_user.email.in_use = true;
  }
  return database_user;
}

// TODO save token and check for still valid tokens
const s2s_authorize = async function() {
  const options = {
    headers: {'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + secret).toString('base64')) },
    form: { grant_type: 'client_credentials' }
  };
  try {
    const post = await got.post('https://accounts.spotify.com/api/token', options);
    const access_token = JSON.parse(post.body).access_token;
    return access_token;
  }
  catch(e) {
    console.log(e);
    return null;
  }
}


module.exports.get_recent_album = async function(artist_id) {
  try {
    const access_token = await s2s_authorize();
    const options = {
      headers: {'Authorization': 'Bearer ' + access_token }
    };

    const album_url = path.join('http://api.spotify.com/v1/artists/', artist_id, '/albums');
    const get = await got(album_url, options);
    const album = JSON.parse(get.body);

    var most_recent = {
      name: album.items[0].name,
      type: album.items[0].type,
      spotify_link: album.items[0].external_urls.spotify,
      api_link: album.items[0].href,
      spotify_id: album.items[0].id,
    }

    if(album.items[0].images[0]) most_recent.image = album.items[0].images[0].url;
    else most_recent.image = 'https://www.pngkey.com/png/full/204-2049354_ic-account-box-48px-profile-picture-icon-square.png';

    return most_recent;
  }
  catch(e) {
    console.log(e)
    return null;
  }
}

module.exports.search = async function(search_term) {
  try {
    const access_token = await s2s_authorize();
    const options = {
      headers: {'Authorization': 'Bearer ' + access_token },
    };
    const search_url = 'https://api.spotify.com/v1/search?' + querystring.stringify(search_term);
    const get = await got(search_url, options);
    const results = JSON.parse(get.body);

    return results.artists;
  }
  catch(e) {
    console.log(e);
    return null;
  }
}

module.exports.get_tokens = async function(code) {
  const url = 'https://accounts.spotify.com/api/token';
  const options = {
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + secret).toString('base64'))
    },
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    }
  };
  const post = await got.post(url, options);
  const result = JSON.parse(post.body);
  return result;
}

module.exports.get_user_info = async function(token) {
  const user_info_url = 'https://api.spotify.com/v1/me';
  const options = {
    headers: { 'Authorization': 'Bearer ' + token.access_token }
  };
  const get = await got(user_info_url, options);
  const result = JSON.parse(get.body);
  return result;
}


module.exports.get_top_artists = async function(limit = 10) {
  const playlist_id = '37i9dQZEVXbMDoHDwVN2tF' // Top 50 global playlist
  if(limit > 10) limit = 10; // hacky way to get top artists so limit to only 10
  try {
    const access_token = await s2s_authorize();
    const options = {
      headers: {'Authorization': 'Bearer ' + access_token },
    };
    const get = await got(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, options);
    const tracks = JSON.parse(get.body).items;
    var top_ten = []

    while(top_ten.length < limit) {
      const track = tracks.pop().track;

      // only add artists if they are unique (this is why we limit to 10)
      var already_exists = false;
      
      top_ten.forEach(artist => {
        if(artist.name === track.artists[0].name) already_exists = true;
      });

      if(!already_exists) top_ten.push(track.artists[0])

      // if we reach the end of the playlist, return whatever we have
      if(tracks.length === 0) break;
    }

    return top_ten;
  }
  catch(e) {
    console.log(e);
    return null;
  }
}
