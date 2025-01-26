const Complaint = require('./complaints.model');
const User = require('../auth/auth.model');

exports.createComplaint = async (complaintData) => {
  return await Complaint.create(complaintData);
};

exports.getComplaintsByStudent = async (studentId) => {
  return await Complaint.findAll({
    where: { student_id: studentId },
    order: [['created_at', 'DESC']],
    include: [{
      model: User,
      as: 'student',
      attributes: ['username', 'email']
    }]
  });
};

exports.getAllComplaints = async () => {
  return await Complaint.findAll({
    order: [['created_at', 'DESC']],
    include: [{
      model: User,
      as: 'student',
      attributes: ['username', 'email']
    }]
  });
};

exports.resolveComplaint = async (complaintId, response) => {
  const complaint = await Complaint.findByPk(complaintId, {
    include: [{
      model: User,
      as: 'student',
      attributes: ['username', 'email']
    }]
  });
  
  if (!complaint) {
    throw new Error('Complaint not found');
  }

  await complaint.update({
    status: 'resolved',
    admin_response: response,
    resolved_at: new Date()
  });

  return complaint;
};