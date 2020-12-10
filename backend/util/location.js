const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = process.env.GOOGLE_API_KEY;

//look up coordinate
async function getCoordsByAddress(address) {
  const res = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = res.data;
  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      'Could not find location for specific address',
      422
    );
    throw error;
  }
  const coordinate = data.results[0].geometry.location;
  return coordinate;
}

module.exports = getCoordsByAddress;
//look up address
//https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
