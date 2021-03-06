const express = require('express');
const router = express.Router();

const WardController = require('../controllers/ward.controller');
const AuthController = require('../controllers/auth.controller');

router.use(AuthController.protect);

router.route('/')
  .get(WardController.getAllWards)
  .post(WardController.createWard);

router
  .route('/:id')
  .get(WardController.getSingleWard)
  .patch(WardController.updateWard)
  .delete(WardController.deleteWard);

module.exports = router;

