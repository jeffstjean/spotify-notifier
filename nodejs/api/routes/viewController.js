const express = require('express');
const router = express.Router();
const http = require('http');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const request = require('request');

const user = "5ce56c7256f5a4fca9001bc3";
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/success";
const stateKey = 'spotify_auth_state';
const scope = process.env.SPOTIFY_SCOPE;
const SpotifyWebApi = require('spotify-web-api-node');

router.get('/', (req, res, next) => {
  res.render('pages/index');
});


router.get('/login', (req, res, next) => {
  var state = generateRandomString(16);
  const query = querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
  });
  res.redirect('https://accounts.spotify.com/authorize?' + query);
});


router.get('/notifications', (req, res, next) => {
  http.get('http://' + req.headers.host + '/users/' + user, (resp) => {
    let artists = '';

    // wait for each chunk
    resp.on('data', (chunk) => {
      artists += chunk;
    });
    // all data received
    resp.on('end', () => {
      const data = JSON.parse(artists);
      res.render('pages/notify', {
        artists: data.artists
      });
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});

router.get('/success', (req, res) => {
  const code = req.query.code;
  var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from((client_id + ':' + client_secret).toString('base64')))
      },
      json: true
    };
    request.post(authOptions, (error, response, body) => {
      var access_token = body.access_token
      var refresh_token = body.refresh_token;

      const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        request.get(options, function(error, response, body) {
          var user = {
            display_name: body.display_name,
            email: body.email,
            url: body.url,
            href: body.href,
            id: body.id,
            img: body.images
          }
          http.get();
          res.cookie('user', user);
          res.redirect(process.env.HOSTNAME + '/notifications');
        });
    });
});

router.get('*', (req, res, next) => {
  res.render('pages/404');
});

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


module.exports = router;
