const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const mongoose = require('mongoose');
const path = require('path');
const HttpError = require('./models/http-error');

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  //what origin that we are allow
  res.setHeader('Access-Control-Allow-Origin', '*');
  //what header property that we are allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH');
  next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Couldnt find this Route', 404);
  throw error;
});

app.use((error, req, res, next) => {
  //error happen delete file
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      //it doesnt matter error happen
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occured!' });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rxsef.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('database connected');
    app.listen(5000);
  })
  .catch(() => {
    console.log('database connect failed');
  });
