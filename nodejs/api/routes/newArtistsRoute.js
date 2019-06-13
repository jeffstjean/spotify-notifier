const http = require('http');
const mongoose = require('mongoose');
const express = require('express');
const querystring = require('querystring');
const request = require('request');
const router = express.Router();


// Input: cookie => access_token and refresh_token
// GET list of followed artists from Spotify (using access_token)
// GET list of followed artists from database (using database ID)
// LOOP through the Spotify artists and find outstanding items to add/delete
// POST/DELETE artists from database to match spotify
// COMPILE userObject containing Spotify and database info
// Output: userObject

// -------------------- GET --------------------- //
router.get('/', (req, res, next) => {
  const access_token = req.cookies.access.access_token;
  const refresh_token = req.cookies.access.refresh_token;
  const _id = req.cookies._id
  request.get(process.env.HOSTNAME + '/users/' + _id + '/artists', (db_err, db_res, db_body) => {
    const options = {
      url: 'https://api.spotify.com/v1/me/following?type=artist',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      json: true
    };
    request.get(options, (spot_err, spot_res, spot_body) => {
      const databaseArtists = JSON.parse(db_body).artists
      const spotifyArtists = spot_body.artists.items
      var databaseIds = [];
      var spotifyIds = [];
      var artistIdsToAdd = [];
      for(var i = 0; i < spotifyArtists.length; i++) {
        spotifyIds.push(spotifyArtists[i].id);
      }
      for(var i = 0; i < databaseArtists.length; i++) {
        databaseIds.push(databaseArtists[i]._id);
      }
      for(var i = 0; i < databaseArtists.length; i++) {
        if(spotifyIds.indexOf(databaseIds[i]) === -1) {
          artistIdsToAdd.push(databaseIds[i]);
          console.log(artistIdsToAdd[i]);
        }
      }
      res.send(artistIdsToAdd);
    });
  });
});
// ---------------------------------------------- //

// -------------------- POST -------------------- //
// TODO: add validation on spotify ID (call to spotify api)
router.post('/', (req, res, next) => {

});
// ---------------------------------------------- //

// -------------------- PATCH ------------------- //
router.patch('/', (req, res, next) => {

});
// ---------------------------------------------- //

// ------------------- DELETE ------------------- //
router.delete('/', (req, res, next) => {

});
// ---------------------------------------------- //

module.exports = router;


// [{
//   "external_urls": {
//     "spotify": "https://open.spotify.com/artist/0eYRYDhbAZqio1f6cqXfiS"
//   },
//   "followers": {
//     "href": null,
//     "total": 17367
//   },
//   "genres": ["indie cafe pop"],
//   "href": "https://api.spotify.com/v1/artists/0eYRYDhbAZqio1f6cqXfiS",
//   "id": "0eYRYDhbAZqio1f6cqXfiS",
//   "images": [{
//     "height": 1000,
//     "url": "https://i.scdn.co/image/5d8a46d28f791fa230f63076b65301d1f52f1c72",
//     "width": 1000
//   }, {
//     "height": 640,
//     "url": "https://i.scdn.co/image/4821bd8e58545b22599486d1429b5755e3d23e6c",
//     "width": 640
//   }, {
//     "height": 200,
//     "url": "https://i.scdn.co/image/a41a06d897bb80ee1352013436655163891f2dd7",
//     "width": 200
//   }, {
//     "height": 64,
//     "url": "https://i.scdn.co/image/2890e2a99ec5e177e2d7133e4691c55554fe05f5",
//     "width": 64
//   }],
//   "name": "Nate Feuerstein",
//   "popularity": 45,
//   "type": "artist",
//   "uri": "spotify:artist:0eYRYDhbAZqio1f6cqXfiS"
// }, {
//   "external_urls": {
//     "spotify": "https://open.spotify.com/artist/1z7b1Pr1rSlvWRzsW3HOrS"
//   },
//   "followers": {
//     "href": null,
//     "total": 2288100
//   },
//   "genres": ["pop", "rap"],
//   "href": "https://api.spotify.com/v1/artists/1z7b1Pr1rSlvWRzsW3HOrS",
//   "id": "1z7b1Pr1rSlvWRzsW3HOrS",
//   "images": [{
//     "height": 640,
//     "url": "https://i.scdn.co/image/dddc432553de17747dc53aedd83ecccf01c14a71",
//     "width": 640
//   }, {
//     "height": 320,
//     "url": "https://i.scdn.co/image/b956e16358d67976a7d0aba0c71fe6d9a4908d40",
//     "width": 320
//   }, {
//     "height": 160,
//     "url": "https://i.scdn.co/image/511f296a10974e172d85c25b4899f71fe6df86c8",
//     "width": 160
//   }],
//   "name": "Russ",
//   "popularity": 84,
//   "type": "artist",
//   "uri": "spotify:artist:1z7b1Pr1rSlvWRzsW3HOrS"
// }, {
//   "external_urls": {
//     "spotify": "https://open.spotify.com/artist/2o8lOQRjzsSC8UdbNN88HN"
//   },
//   "followers": {
//     "href": null,
//     "total": 168086
//   },
//   "genres": ["indie pop rap", "pop", "pop rap"],
//   "href": "https://api.spotify.com/v1/artists/2o8lOQRjzsSC8UdbNN88HN",
//   "id": "2o8lOQRjzsSC8UdbNN88HN",
//   "images": [{
//     "height": 640,
//     "url": "https://i.scdn.co/image/e8e932b93506e47dccc859fe0387218e885a3f99",
//     "width": 640
//   }, {
//     "height": 320,
//     "url": "https://i.scdn.co/image/0db66f2a282e17c3e1a613345d5eef08463e235a",
//     "width": 320
//   }, {
//     "height": 160,
//     "url": "https://i.scdn.co/image/a4d8126ebed7bc6d4ee28fcc3b9e97a4de99abed",
//     "width": 160
//   }],
//   "name": "mansionz",
//   "popularity": 65,
//   "type": "artist",
//   "uri": "spotify:artist:2o8lOQRjzsSC8UdbNN88HN"
// }, {
//   "external_urls": {
//     "spotify": "https://open.spotify.com/artist/2q3GG88dVwuQPF4FmySr9I"
//   },
//   "followers": {
//     "href": null,
//     "total": 270972
//   },
//   "genres": ["modern alternative rock", "modern rock"],
//   "href": "https://api.spotify.com/v1/artists/2q3GG88dVwuQPF4FmySr9I",
//   "id": "2q3GG88dVwuQPF4FmySr9I",
//   "images": [{
//     "height": 640,
//     "url": "https://i.scdn.co/image/521526722bef81cd29a2dcba642c087fdec1bb3e",
//     "width": 640
//   }, {
//     "height": 320,
//     "url": "https://i.scdn.co/image/57c44964d71d70818b9964991ddb8b3c7259af1b",
//     "width": 320
//   }, {
//     "height": 160,
//     "url": "https://i.scdn.co/image/6756b8a485221464d081c27938e6d60b01e7834b",
//     "width": 160
//   }],
//   "name": "The Score",
//   "popularity": 73,
//   "type": "artist",
//   "uri": "spotify:artist:2q3GG88dVwuQPF4FmySr9I"
// }, {
//   "external_urls": {
//     "spotify": "https://open.spotify.com/artist/3v2NAsnsViisa2k0CNolXW"
//   },
//   "followers": {
//     "href": null,
//     "total": 48809
//   },
//   "genres": [],
//   "href": "https://api.spotify.com/v1/artists/3v2NAsnsViisa2k0CNolXW",
//   "id": "3v2NAsnsViisa2k0CNolXW",
//   "images": [{
//     "height": 640,
//     "url": "https://i.scdn.co/image/755f632132d66a59b861ad3590c8c993d33370cb",
//     "width": 640
//   }, {
//     "height": 320,
//     "url": "https://i.scdn.co/image/15aed0f204a2f64652b641a1d05c00656eb60a35",
//     "width": 320
//   }, {
//     "height": 160,
//     "url": "https://i.scdn.co/image/f2c492a65879ff8fedbd3be04482b99019f0df07",
//     "width": 160
//   }],
//   "name": "Rynx",
//   "popularity": 58,
//   "type": "artist",
//   "uri": "spotify:artist:3v2NAsnsViisa2k0CNolXW"
// }, {
//   "external_urls": {
//     "spotify": "https://open.spotify.com/artist/7dGJo4pcD2V6oG8kP0tJRR"
//   },
//   "followers": {
//     "href": null,
//     "total": 26811113
//   },
//   "genres": ["detroit hip hop", "g funk", "hip hop", "rap"],
//   "href": "https://api.spotify.com/v1/artists/7dGJo4pcD2V6oG8kP0tJRR",
//   "id": "7dGJo4pcD2V6oG8kP0tJRR",
//   "images": [{
//     "height": 640,
//     "url": "https://i.scdn.co/image/60c4daa4721f666c6afaee82a39bd413979a0474",
//     "width": 640
//   }, {
//     "height": 320,
//     "url": "https://i.scdn.co/image/ae8dd3b01ada324eeb8c0b341e8f7ebda406095e",
//     "width": 320
//   }, {
//     "height": 160,
//     "url": "https://i.scdn.co/image/ed213a32e1327f3f2d7b2539eb1db57f55b68dbb",
//     "width": 160
//   }],
//   "name": "Eminem",
//   "popularity": 94,
//   "type": "artist",
//   "uri": "spotify:artist:7dGJo4pcD2V6oG8kP0tJRR"
// }]
