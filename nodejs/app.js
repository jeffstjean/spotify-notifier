// imports
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use(cookieParser());

const userRoutes = require('./api/routes/users');
//const viewRoutes = require('./api/routes/viewController');
const notificationRoute = require('./api/routes/notificationRoute');
const loginRoute = require('./api/routes/loginRoute');
const newArtistsRoute = require('./api/routes/newArtistsRoute');

// connect to database
mongoose.connect('mongodb+srv://jeffstjean:' + process.env.MONGO_ATLAS_PW + '@restful-product-test-db-ttnx6.mongodb.net/test?retryWrites=true', {
  useNewUrlParser: true
});

app.use(morgan('dev')); // data logging
app.use(bodyParser.urlencoded({
  extended: false
})); // url body parsing
app.use(bodyParser.json()); // json body parsing

// avoid CORS errors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); // supported verbs
    return res.status(200).json({});
  }
  next();
});

// routes
app.use('/users', userRoutes);
app.use('/notifications', notificationRoute);
app.use('/login', loginRoute);
app.use('/new-artists', newArtistsRoute);
//app.use('/', viewRoutes);


// any request that reaches this line will not have been routed (aka not implemented)
// throw an error
app.use((req, res, next) => {
  const error = new Error('Path not found.');
  error.status = 404;
  next(error);
});

// catch any errors - not just the above error
app.use((error, req, res, next) => {
  res.status(error.status || 500); // either return the error if passed from above or set to 500
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
