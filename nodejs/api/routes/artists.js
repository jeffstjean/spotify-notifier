const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');
const User = require('../models/user');
const Artist = require('../models/artist');

// TODO: test each verb
// TODO: validate artist creation with spotify

// --------------------- GET -------------------- //

router.get('/', (req, res, next) => {
  const id = req.userId;
  User.findById(id, '-__v')
    .select()
    .exec()
    .then(user => {
      if (user) {
        res.status(200).json(user.artists);
      } else {
          res.status(404).json({message: 'Cannot get user\'s artists: ID does not exist'});
      }
    })
    .catch(err => {
      res.status(500).json({message: 'Cannot get user\'s artists: Invalid ID format', error: err});
    });
});
// ---------------------------------------------- //

// -------------------- POST -------------------- //
router.post('/', (req, res, next) => {
  const id = req.userId;
  // create a new Artist from the request
  let artist = new Artist(req.body);
  // set the _id
  artist._id = new mongoose.Types.ObjectId();
  // save the artist to the database
  artist.save()
  .then(resultArtist => {
    User.findById(id, '-__v')
    .exec()
    .then(resultUser => {
      resultUser.artists.push(resultArtist);
      resultUser.save()
      .then(updatedUser => {
        res.status(201).json({'message': 'Artist successfully added to user','updated user:': updatedUser});
      })
      .catch(artistAddErr => {
        res.status(500).json({
          message: 'Cannot add artist to user: See detailed error',
          error: artistAddErr.message
        });
      });
    })
    .catch(userFetchErr => {
      res.status(500).json({
        message: 'Cannot fetch user: See detailed error',
        error: userFetchErr.message
      });
    });
  })
  .catch(artistCreateErr => {
    res.status(500).json({
      message: 'Cannot create artist: See detailed error',
      error: artistCreateErr.message
    });
  });
});
// ---------------------------------------------- //

// ------------------ GET BY ID ----------------- //
router.get('/:artistId/', (req, res, next) => {
  const userId = req.userId;
  const artistId = req.params.artistId;
  User.findById(userId, '-__v')
  .exec()
  .then(user => {
    if(user) {
      res.status(200).json(user);
    }
    else {
      res.status(404).json({message: 'Cannot get user\'s artists: ID does not exist'});
    }
  })
  .catch(err => {
    res.status(500).json({message: 'Cannot get user\'s artists: Invalid ID format', error: err});
  });
});
// ---------------------------------------------- //

// ---------------- DELETE ARTIST --------------- //
// check if artist exists
router.delete('/:artistId/', (req, res, next) => {
  const userId = req.userId;
  const artistId = req.params.artistId;
  User.findByIdAndUpdate(userId, { $pull: {"artists":{_id: artistId}} }, { useFindAndModify: false, new: true })
  .exec()
  .then(updatedUser => {
    res.status(200).json({message: 'Deleted artist', updatedUser: updatedUser});
  })
  .catch(updateErr => {
    res.status(500).json({message: 'Cannot delete artist', error: updateErr});
  });
});
// ---------------------------------------------- //

module.exports = router;
