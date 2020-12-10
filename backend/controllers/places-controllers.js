const HttpError = require('../models/http-error.js');
const { validationResult } = require('express-validator');
const getCoordsByAddress = require('../util/location');
const mongoose = require('mongoose');
const Place = require('../models/place');
const User = require('../models/user');
const fs = require('fs');

const getPlaceById = async (req, res, next) => {
  const pid = req.params.pid;
  let place;
  try {
    place = await Place.findById(pid).exec();
  } catch (err) {
    const error = new HttpError('something went wrong', 500);
    return next(error);
  }
  if (!place) {
    const error = new HttpError(
      'could not find the place for the provided id',
      404
    );
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

// const getPlacesByUserId = async (req, res, next) => {
//   const userId = req.params.userId;
//   let places;
//   try {
//     places = await Place.find({ creatorId: userId });
//   } catch (err) {
//     const error = new HttpError('something went wrong', 500);
//     return next(error);
//   }
//   if (!places || !places.length) {
//     return next(
//       new HttpError('could not find the place for the provided id', 404)
//     );
//   }
//   res.json({
//     places: places.map((place) => place.toObject({ getters: true })),
//   });
// };

//anothor approch
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    const error = new HttpError('something went wrong', 500);
    return next(error);
  }
  if (
    !userWithPlaces ||
    !userWithPlaces.places ||
    !userWithPlaces.places.length
  ) {
    return next(
      new HttpError('could not find the place for the provided id', 404)
    );
  }
  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed ,pls check your data', 422)
    );
  }
  const { title, description, address } = req.body;
  const creatorId = req.userData.userId;

  let coordinates;
  try {
    coordinates = await getCoordsByAddress(address);
  } catch (err) {
    return next(err);
  }
  const createPlace = new Place({
    title,
    description,
    address,
    imageUrl: req.file.path,
    location: coordinates,
    creatorId,
  });
  let user;
  try {
    user = await User.findById(creatorId);
  } catch (err) {
    console.log(err);
    const error = new HttpError('Creating place failed');
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      'couldnt find the user for the  provided id',
      404
    );
    return next(error);
  }
  //mongoose transaction
  try {
    //store move in session
    const sess = await mongoose.startSession();
    //start session
    sess.startTransaction();
    //store this move in this session
    await createPlace.save({ session: sess });
    //mongoose will only push id in this
    user.places.push(createPlace);
    await user.save({ session: sess });
    // store in DB ,one fail all roll back
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Creating place failed');
    return next(error);
  }
  res.status(201).json({ place: createPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed ,pls check your data', 422)
    );
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'something went wrong,could not update place',
      500
    );
    return next(error);
  }
  //place.creatorId is Object id to make it String  toString()
  if (place.creatorId.toString() !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to edit this place .',
      401
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'something went wrong,could not update place',
      500
    );
    return next(error);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate('creatorId');
  } catch (err) {
    const error = new HttpError(
      'something went wrong,could not delete place',
      500
    );
    return next(error);
  }
  if (!place) {
    const error = new HttpError('could not find the place', 500);
    return next(error);
  }
  if (place.creatorId.id !== req.userData.userId) {
    const error = new HttpError('not allowed to delete the place', 401);
    return next(error);
  }
  const imagePath = place.imageUrl;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    //pull deletee place id
    place.creatorId.places.pull(place);
    // place.creatorId  is like User instance
    await place.creatorId.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'something went wrong,could not delete place',
      500
    );
    return next(error);
  }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
  res.status(200).json({ message: 'delete success' });
};

exports.createPlace = createPlace;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
