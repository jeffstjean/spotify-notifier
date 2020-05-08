const router = require('express').Router();
const { update_artists } = require('../jobs/UpdateArtists')
const { CheckAuthorized } = require('../tools/AuthTools')
var JOB_DELTA = 3 * 60 * 1000 * 60;
var update_job = null;

router.get('/start-update', (req, res) => {
    if(update_job === null) {
        clearInterval(update_job)
        console.log('started artist update job')
        update_job = setInterval(() => { update_artists() }, JOB_DELTA)
    }
    res.send('Job started')
});

router.get('/stop-update', (req, res) => {
    if(update_job !== null) {
        clearInterval(update_job);
        console.log('stopped artist update job')
        update_job = null;
    }
    res.send('Job ended')
});

router.get('/update-delta', async (req, res) => {
    if(req.query.delta) {
        JOB_DELTA = req.query.delta * 1000 * 60;
        console.log(`Set artist update delta to ${req.query.delta} minutes`)
        clearInterval(update_job);
        update_job = setInterval(() => { update_artists() }, JOB_DELTA)
        res.send(`New delta is ${req.query.delta} minutes`)
    }
    res.status(404).send('Please send a new delta using /update-delta?delta=___')
});

module.exports = router;