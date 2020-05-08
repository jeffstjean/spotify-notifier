const router = require('express').Router();
const Spotify = require('../tools/SpotifyTools');

router.get('/top', async (req, res) => {
    const limit = req.query.limit ? req.query.limit : 10 // default to 10
    const top = await Spotify.get_top_artists(limit);
    res.json(top)
});

module.exports = router;