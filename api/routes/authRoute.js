const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const querystring = require('querystring');
const request = require('request');
const User = require('../models/user');
const { generateRandomString } = require('../misc/utilities.js');


// -------------------- GET --------------------- //
router.get('/', (req, res, next) => {
  const state = generateRandomString(16);
  res.cookie('state', state);
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: process.env.SPOTIFY_SCOPE,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      state: state }));
});


router.get('/success', async(req, res, next) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies['state'] : null;

  if (state === null || state !== storedState) {
    res.redirect('/auth/error');
  } else {
    res.clearCookie('state');
    try {
      var tokens = await getTokens(code);
      tokens.issued = new Date();
      const userInfo = await getUserInfo(tokens.access_token);
      var userFromDatabase = await User.findOne({ spotify_id: userInfo.id });
      if(userFromDatabase == null) userFromDatabase = await createNewUser(userInfo);
      res.cookie('user', userFromDatabase.generateAuthToken());
      res.cookie('token', jwt.sign(tokens, '1234'));
      res.redirect('/update-artists');
    } catch(e) {
      console.error(e);
      res.send('ERROR');
    }
  }
});

router.get('/error', (req, res, next) => {
  res.send('ERROR');
});

const getTokens = function(code) {
  return new Promise((resolve, reject) => {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: { code: code, redirect_uri: process.env.SPOTIFY_REDIRECT_URI, grant_type: 'authorization_code' },
      headers: { 'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' +
        process.env.SPOTIFY_CLIENT_SECRET).toString('base64')) },
      json: true
    };
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        resolve({ access_token: body.access_token, refresh_token: body.refresh_token });
      }
      else reject(error);
    });
  });
}

const getUserInfo = function(access_token) {
  return new Promise((resolve, reject) => {
    var options = {
      url: 'https://api.spotify.com/v1/me',
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    };
    request.get(options, function(error, response, body) {
      resolve(body);
    });
  });
}

const createNewUser = function(userInfo) {
  console.log('Creating new user!');
  return new Promise(async(resolve, reject) => {
    try {
      const newUser = await new User({
        spotify_id: userInfo.id,
        display_name: userInfo.display_name,
        url: userInfo.external_urls.spotify,
        image: userInfo.images[0].url,
        email_address: userInfo.email
      }).save();
      resolve(newUser);
    } catch(e) {
      console.error(e);
      reject('unable to create user');
    }


  });
}

module.exports = router;
