const express = require('express');
const { check } = require('express-validator');
const placeControllers = require('../controllers/places-controllers');
const router = express.Router();
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

router.get('/:pid', placeControllers.getPlaceById);

router.get('/user/:userId', placeControllers.getPlacesByUserId);

router.use(checkAuth);

//title, description, address, coordinates, creatorId
router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('description').not().isEmpty().isLength({ min: 5 }),
    check('address').not().isEmpty(),
  ],
  placeControllers.createPlace
);

router.patch(
  '/:pid',
  [
    check('title').not().isEmpty(),
    check('description').not().isEmpty().isLength({ min: 5 }),
  ],
  placeControllers.updatePlace
);

router.delete('/:pid', placeControllers.deletePlace);

module.exports = router;
