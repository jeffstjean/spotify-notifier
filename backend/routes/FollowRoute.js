const router = require('express').Router();
const Spotify = require('../tools/SpotifyTools');
const Artist = require('../models/ArtistModel');
const User = require('../models/UserModel');
const mongoose = require('mongoose')
const { CheckAuthorized } = require('../tools/AuthTools');

// get artists that a user follows
router.get('/follow', CheckAuthorized, async (req, res) => {
    const user_id = req.user._id
    const user = await User.findById(user_id).populate('followed_artists')
    res.json(user.followed_artists);
});

// have a given user follow an artist
router.put('/follow', CheckAuthorized, async (req, res) => {
    const { spotify_id } = req.body; // grab the artist's spotify id
    const following_user_id = req.user._id;
    
    if(!spotify_id || spotify_id === '') {
        return res.send('InvalidId');
    }

    const is_existing = await Artist.findOne({ spotify_id });
    var artist;

    if(!is_existing) {
        const spotify_artist = await Spotify.get_artist(spotify_id);
        const recent_album = await Spotify.get_recent_album(spotify_id);

        console.log(`Creating new artist: ${spotify_artist.name}`);
        artist = await new Artist(Spotify.spotify_artist_to_db(spotify_artist, recent_album)).save();
    }
    else {
        artist = is_existing;
    }

    // add user to artist, only if user is not already following artist - idempotent after first follow
    artist = await Artist.findByIdAndUpdate(artist._id, { $addToSet: { following_users: following_user_id }});

    await User.findByIdAndUpdate(following_user_id, { $addToSet: { followed_artists: artist._id }});

    console.log(`${following_user_id} followed ${spotify_id}`);

    res.status(204).send();
});

// have a given user unfollow an artist
router.post('/follow', CheckAuthorized, async (req, res) => {
    const { spotify_id } = req.body; // grab the artist's spotify id
    const unfollowing_user_id = req.user._id
    var artist = await Artist.findOne({ spotify_id });
    
    if(!artist) {
        return res.status(404).send('InvalidArtist');
    }

    artist = await Artist.findByIdAndUpdate(artist._id, { $pull: { following_users: unfollowing_user_id }});

    await User.findByIdAndUpdate(unfollowing_user_id, { $pull: { followed_artists: artist._id }});

    console.log(`${unfollowing_user_id} unfollowed ${spotify_id}`);

    res.status(204).send();
});

// for update artists
router.get('/update', CheckAuthorized, async (req, res) => {
    const { update_artists } = require('../jobs/UpdateArtists');
    update_artists();
    res.send('Forcing update.')
});

module.exports = router;