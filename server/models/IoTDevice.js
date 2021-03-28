const mongoose = require('mongoose');

const iotDeviceSchema = new mongoose.Schema({
  lighting: {
    type: Number,
    default: 800,
  },
  airCondition: {
    type: String,
    default: 'ok',
    enum: ['ok', 'middle', 'bad']
  },
  location: [Number],
});

const IoTDevice = mongoose.model('IoTDevice', iotDeviceSchema);

module.exports = IoTDevice;