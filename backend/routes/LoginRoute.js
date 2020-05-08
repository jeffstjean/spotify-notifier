const router = require('express').Router();
const Spotify = require('../tools/SpotifyTools')
const querystring = require('querystring');
const User = require('../models/UserModel');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = `${process.env.DOMAIN}:${process.env.PORT}/callback`;

router.get('/login', (req, res) => {
    const state = generate_random_string(16);
    res.cookie('state', state);
    res.cookie('origin', req.query.origin)
    const spotify_url = Spotify.get_auth_url(state);
    res.redirect(spotify_url);
});

router.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const stored_state = req.cookies ? req.cookies.state : null;
    const domain = `${process.env.DOMAIN}:${process.env.REACT_PORT}`

    const is_index = new URL(req.cookies.origin).pathname.substring(1) === '';
    const is_error = new URL(req.cookies.origin).pathname.substring(1) === 'error'
    var origin = req.cookies ? req.cookies.origin : `${domain}`
    if(is_index || is_error) origin = `${domain}/dashboard`

    res.clearCookie('state');
    res.clearCookie('origin')

    if(state === null || state !== stored_state) {
        res.json({ error: true, code, state, stored_state });
    }
    else {
        const spotify_token = await Spotify.get_tokens(code);
        const spotify_user = await Spotify.get_user_info(spotify_token);
        const is_existing = await User.findOne({ spotify_id: spotify_user.id });

        var user;
        if(is_existing) {
            console.log('user already exists');
            user = is_existing;
            res.status(200);
        }
        else {
            console.log('checking whitelist')
            const fs = require('fs').promises;
            const file = (await fs.readFile('whitelist.csv')).toString()
            const valid_ids = file.split(',')
            const match = valid_ids.filter(valid_id => valid_id === spotify_user.id)
            const is_whitelisted = match.length >= 1

            if(is_whitelisted) {
                console.log('creating new user')
                var user_data = Spotify.spotify_user_to_db(spotify_user)
                const new_user = await new User(user_data).save();
                user = new_user
                res.status(201);
            }
            else {
                console.log('Non-whitelisted user')
                return res.status(401).send('NonWhiteListedUser');
            }
        }

        const jwt_token = user.generate_jwt();
        res.cookie('authorization', jwt_token);
        res.redirect(origin);
    }
});

const generate_random_string = function(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var text = '';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };


module.exports = router;
