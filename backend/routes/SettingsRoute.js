const router = require('express').Router();
const User = require('../models/UserModel');
const { CheckAuthorized } = require('../tools/AuthTools');

router.get('/settings', CheckAuthorized, async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json(user)
});

router.get('/settings/artists', CheckAuthorized, async (req, res) => {
    const user = await User.findById(req.user._id).populate('followed_artists').exec();
    res.status(200).json(user.followed_artists)
});

router.put('/settings', CheckAuthorized, async (req, res) => {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true })
    res.status(200).json(user);
});

router.delete('/settings', CheckAuthorized, async (req, res) => {
    await User.findByIdAndDelete(req.user._id);
    res.clearCookie('authorization');
    res.status(204).send();
});

module.exports = router;