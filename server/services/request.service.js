const { forEach } = require('p-iteration');
const Request = require('../models/Request');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const sendNotification = (receiver, patient, message) => {
  console.log(`Sending notification of patient: ${patient} to doctor: ${receiver} with message: ${message}`);
};

const setTimeoutResponse = (doctorId, requestData) => {
  setTimeout((doctorId, requestData) => {
    Doctor.findById(doctorId).then((doctor) => {
      if (!doctor.patients.includes(patientId)) {
        exports.processRequest(
          requestData.patient,
          requestData.message,
          requestData.priority,
          false, 
          [doctorId]
        );
      }
    });
  }, 1000, doctorId, requestData);
};

exports.processRequest = async (patient, message, priority, request = false, notSendToDoctors = false) => {
  const takingCareDoctors = await Doctor.find({
    patients: { $in: [patient.id] }
  });

  if (!takingCareDoctors.length) {
    const freeDoctors = await Doctor.find({
      id: { $in: [notSendToDoctors] },
      status: 'free'
    });

    const requestData = {
      patientId: patient.id,
      requestType: message,
      priority
    };

    if (freeDoctors && freeDoctors.length) {
      for (let i = 0; i < freeDoctors.length; i++) {
        const currentDoctor = freeDoctors[i];

        if (notSendToDoctors.includes(currentDoctor.id)) {
          continue;
        } else if (currentDoctor.status === 'free') {
          sendNotification(currentDoctor.fullName, patient.fullName, message);
          setTimeoutResponse(currentDoctor.id, { ...requestData, patient });
        }
      }
    } else {
      if (!request) {
        await Request.create(requestData);
      } else {
        await Request.findByIdAndUpdate(request.id, {
          ...requestData
        });
      }

      if (['high', 'highest'].includes(priority)) {
        const nurses = await Doctor.find({
          id: { $in: [notSendToDoctors] },
          speciality: 'NURSE'
        });

        for (let i = 0; i < nurses.length; i++) {
          const currentNurse = nurses[i];
          sendNotification(currentNurse.fullName, patient.fullName, message);
          setTimeoutResponse(currentNurse.id, { ...requestData, patient });
        }
      }
    }
  }
};

exports.processDoctorTreating = async (doctorId, patientId) => {
  const doctor = await Doctor.findById(doctorId);

  doctor.patients.push(patientId);
  doctor.status = 'occupied';
  await doctor.save();

  await Request.findOneAndUpdate({ patientId }, { status: 'resolved' });
};

exports.processDoctorFinishedTreating = async (doctorId, patientId) => {
  const doctor = await Doctor.findById(doctorId);

  doctor.patients = doctor.patients.filter((patient) => patient.toString() !== patientId);

  if (doctor.patients.length === 0) {
    doctor.status = 'free';
  }

  await doctor.save();
};

exports.processScheduledRequests = async (priorities) => {
  const scheduledRequests = await Request.find({
    status: 'opened',
    priority: { $in: priorities }
  });

  await forEach(scheduledRequests, async (request) => {
    const patient = await Patient.findById(request.patientId);

    await this.processRequest(patient, request.message, request.priority);
  });
};