require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors')
const cookie_parser = require('cookie-parser')

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
var artist_update_job;

const port = process.env.NODE_PORT || 5000;
const environment = process.env.NODE_ENV || 'development';

// connect to db
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .catch(err => { console.log('Error connecting to database: ' + err); });

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// cors
// app.use(cors());
app.use(cors({ origin: `${process.env.DOMAIN}:${process.env.REACT_PORT}`, credentials: true }));

// routes
app.use('/', require('./routes/LoginRoute'));
app.use('/', require('./routes/LogoutRoute'));
app.use('/', require('./routes/FollowRoute'));
app.use('/', require('./routes/SearchRoute'));
app.use('/', require('./routes/SettingsRoute'));
app.use('/', require('./routes/TopRoute'));
app.use('/', require('./routes/JobRoute'));
app.get("/ping", (req, res) => { res.status(200).send('pong'); });

app.listen(port, () => {
  const BLUE = '\x1b[34m', RESET = '\x1b[0m';
  console.log(`Server started on port ${BLUE}${port}${RESET} in ${BLUE}${environment}${RESET} mode`);
});

mongoose.connection.on('connected', err => {
  console.log('Connected to database');
});
