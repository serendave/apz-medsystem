const express = require('express');
const router = express.Router();

const IoTDeviceController = require('../controllers/iotdevice.controller');

router.route('/')
  .get(IoTDeviceController.getAllIoTDevices)
  .post(IoTDeviceController.createIoTDevice);

router
  .route('/:id')
  .get(IoTDeviceController.getSingleIoTDevice)
  .patch(IoTDeviceController.updateIoTDevice)
  .delete(IoTDeviceController.deleteIoTDevice);

module.exports = router;
