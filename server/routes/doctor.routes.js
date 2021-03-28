const express = require('express');
const router = express.Router();

const DoctorController = require('../controllers/doctor.controller');

router.route('/').get(DoctorController.getAllDoctors).post(DoctorController.createDoctor);

router
  .route('/:id')
  .get(DoctorController.getSingleDoctor)
  .patch(DoctorController.updateDoctor)
  .delete(DoctorController.deleteDoctor);

module.exports = router;
