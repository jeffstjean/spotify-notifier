const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');



// -------------------- GET --------------------- //
router.get('/', (req, res, next) => {
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
