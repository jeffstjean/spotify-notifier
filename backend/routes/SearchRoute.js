const router = require('express').Router();
const Spotify = require('../tools/SpotifyTools');
const { CheckAuthorized } = require('../tools/AuthTools');

router.get('/search', async (req, res) => {
  const { q, type, limit, offset } = req.query
  try {
    const search_result = await Spotify.search(req.query);
    res.json(search_result);
  }
  catch(e) {
    console.log(e);
    res.json(e);
  }
})

module.exports = router;
