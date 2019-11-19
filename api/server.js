const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const jobs = require('./jobs/agenda');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true })
  .then(() => { console.log('Connected to database'); })
  .catch(err => { console.error('Error connecting to database: ' + err);
  });

jobs.start();

// app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// routes
app.use('/user', require('./routes/userRoute'));
app.use('/auth', require('./routes/authRoute'));
app.use('/update-artists', require('./routes/updateRoute'));

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
