const router = require('express').Router();

router.get('/logout', (req, res) => {
    const origin = req.query.origin ? req.query.origin : `${process.env.DOMAIN}:${process.env.REACT_PORT}`
    res.clearCookie('authorization');
    res.redirect(origin);
});

module.exports = router;