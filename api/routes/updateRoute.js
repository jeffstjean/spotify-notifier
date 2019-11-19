const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { updateUserArtists } = require('../misc/checkForNewArtists');

router.get('/', async(req, res, next) => {
  const user_id = req.cookies ? jwt.verify(req.cookies.user, '1234')._id : null;
  var token = req.cookies ? jwt.verify(req.cookies.token, '1234') : null;
  if(user_id == null || token == null) res.send('no user or token cookie');
  else {
    updateUserArtists(user_id, token)
      .then(result => {
        res.cookie('token', jwt.sign(result.token, '1234'));
        res.json(result.user);
      })
      .catch(err => {
        console.log(err);
        res.json(err)
      });
  }
});

module.exports = router;
