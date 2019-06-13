const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const querystring = require('querystring');
const request = require('request');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const scope = process.env.SPOTIFY_SCOPE;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const stateKey = 'spotify_auth_state';


// -------------------- GET --------------------- //
router.get('/', (req, res, next) => {
  if (req.cookies.spotifyId) {
    //console.log('Valid_ID: ', req.cookies.spotifyId);
    request.get(process.env.HOSTNAME + 'users/spotifyId/' + req.cookies.spotifyId, (db_err, db_res, db_body) => {
      var user = JSON.parse(db_body);
      //console.log('DB_ID: ', user.spotifyId);
      if (user.spotifyId) {
        // user exists - need to send to newArtists
        //console.log('user exists');
        res.cookie('_id', user._id);
        res.clearCookie('spotifyId'); // no longer need this
        res.redirect(process.env.HOSTNAME + '/new-artists');
      } else {
        // user does not exist - need to create then send to newArtists
        console.log('user does not exist');
        //console.log(req.cookies.user);
        user = {
          display_name: req.cookies.user.display_name,
          email: req.cookies.user.email,
          href: req.cookies.user.href,
          spotifyId: req.cookies.user.id,
          img: req.cookies.user.images[0].url
        };
        request.post({ // create user
          url: process.env.HOSTNAME + '/users',
          form: user
        }, (post_err, post_res, post_body) => {
          console.log('user created');
          //res.send(post_body);
          res.redirect(process.env.HOSTNAME + '/login');
        });
      }
    });
  } else if (req.cookies.access) { // have valid access token
    const options = {
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + req.cookies.access.access_token
      },
      json: true
    };
    request.get(options, (spot_err, spot_res, spot_body) => {
      if (spot_body.id) {
        //console.log('spotifyId:', spot_body.id);
        res.cookie('spotifyId', spot_body.id);
        res.cookie('user', spot_body);
        res.redirect(process.env.HOSTNAME + '/login');
      }
    });
  } else if (req.cookies.postToken) { // callback - must post to get access

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      // TODO: Handle this
      console.log('state mismatch');
      res.redirect('http://twitter.com');
    } else {
      res.clearCookie(stateKey); // no longer need this

      var authOptions = { // correctly setting options
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };

      // need to retrive access_token and refresh_token
      request.post(authOptions, (error, response, body) => {
        res.clearCookie('postToken');
        if (!error && response.statusCode === 200) {
          res.cookie('access', {
            time: Date.now(),
            access_token: body.access_token,
            refresh_token: body.refresh_token
          });
          // now have access cookie - this redirect will send users through first if statement
          res.redirect(process.env.HOSTNAME + 'login')

        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }


  } else { // first step for unauth'd user
    res.cookie('postToken', true); // send user to post step (above)

    const state = generateRandomString(16); // used to check if response was tampered
    res.cookie(stateKey, state);

    const query = {
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    };

    res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify(query));

  }
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
