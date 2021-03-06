const mongoose = require('mongoose');
const Ward = require('./Ward');

const patientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    maxlength: [30, "Patient's full name can't be more than 30 characters"]
  },
  dateOfBirth: Date,
  mobileNumber: String,
  deliveryReason: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryReason',
    required: true
  },
  diagnosis: String,
  wardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ward',
    required: [true, 'Patient must be set to some ward.']
  },
  iotDeviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IoTDevice'
  },
  pulse: {
    type: Number,
    min: [0, 'Pulse is an absolute scale and cannot be less that 0'],
    unit: 'bpm',
    default: 70
  },
  bloodPressure: {
    systolic: {
      type: Number,
      default: 120,
      min: [0, 'Blood pressure is an absolute scale and cannot be less that 0']
    },
    diastolic: {
      type: Number,
      default: 80,
      min: [0, 'Blood pressure is an absolute scale and cannot be less that 0']
    }
  },
  temperature: {
    type: Number,
    default: 36.6
  }
});

patientSchema.post('save', async function(doc) {
  const ward = await Ward.findById(doc.wardId);
  
  ward.patientsCount++;
  await ward.save();
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;