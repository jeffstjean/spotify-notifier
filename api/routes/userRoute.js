const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const Artist = require('../models/artist');
const artistRoutes = require('./artists');

// TODO: validate user creation with spotify
// TODO: do not allow id updates

// -------------------- GET --------------------- //
router.get('/', (req, res, next) => {
  User.find({}, '_id display_name spotify_id email_address')
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      users: docs
    }
    res.status(200).json(response);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      message: 'Cannot get users: See detailed error',
      error: err
    });
  });
 });
// ---------------------------------------------- //

// -------------------- POST -------------------- //
// TODO: add validation on spotify ID (call to spotify api)
router.post('/', (req, res, next) => {
  // create a new User from the request
  let user = new User(req.body);
  // set the _id
  user._id = new mongoose.Types.ObjectId();
  // save the user to the database
  user.save()
  .then(result => {
    res.status(201).json({'message': 'User successfully created','created user:': result});
  })
  .catch(err => {
    res.status(500).json({
      message: 'Cannot create user - fields are missing: See detailed error',
      error: err.message
    });
  });
});
// ---------------------------------------------- //

// ------------------ GET BY ID ----------------- //
router.get('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.findById(id, '-__v')
  .exec()
  .then(doc => {
    if(doc) {
      res.status(200).json(doc);
    }
    else {
      res.status(404).json({message: 'Cannot get user: ID does not exist'});
    }
  })
  .catch(err => {
    res.status(500).json({message: 'Cannot get user: Invalid ID format'});
  });
});
// ---------------------------------------------- //

// -------------------- PATCH ------------------- //

// parameters must be contained in the body like such:
// { "display_name": "name", "email_address": "test@test.ca" }

router.patch('/:userId', (req, res, next) => {
  const id = req.params.userId;
  // TODO: use User.findByIdAndUpdate() instead
  // new: true returns the update document
  User.findOneAndUpdate({ _id: id }, req.body, { useFindAndModify: false, new: true })
  .exec()
  .then(result => {
    if(result) {
      res.status(200).json({
           message: 'User successfully updated',
           updatedUser: result
      });
    }
    else {
      res.status(404).json({
           message: 'Cannot update user: ID does not exist',
      });
    }
  })
  .catch(err => {
    res.status(500).json({
         message: 'Cannot get user: Invalid ID format'
    });
  });
});
// ---------------------------------------------- //

// ------------------- DELETE ------------------- //
router.delete('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.findOneAndDelete({_id: id})
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'User deleted',
      deletedUser: {
        _id: result._id,
        spotifyId: result.spotifyId,
        display_name: result.display_name,
        href: result.href
      }
    });
  })
  .catch(err => {
    res.status(500).json({message: 'Cannot delete user: User does not exist'});
  });
});
// ---------------------------------------------- //

// ------------------- ARTISTS ------------------ //
// router.use('/:userId/artists', (req, res, next) => { // forward artists requests on to artists.js
//   req.userId = req.params.userId; // BUT attach the userID to the req so we can access on other side
//   next();
// }, artistRoutes);
// ---------------------------------------------- //

module.exports = router;
