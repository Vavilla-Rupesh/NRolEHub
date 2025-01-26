const ComplaintsService = require('./complaints.service');
const { sendNotificationMail } = require('../../utils/mailer');

exports.createComplaint = async (req, res) => {
  try {
    const complaintData = {
      ...req.body,
      student_id: req.user.id
    };
    const complaint = await ComplaintsService.createComplaint(complaintData);
    res.status(201).json({ message: 'Complaint submitted successfully', complaint });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getComplaintsByStudent = async (req, res) => {
  try {
    const complaints = await ComplaintsService.getComplaintsByStudent(req.user.id);
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await ComplaintsService.getAllComplaints();
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    
    const complaint = await ComplaintsService.resolveComplaint(id, response);
    
    // Send email notification to student
    try {
      await sendNotificationMail(
        complaint.student.email,
        'Complaint Resolution',
        '',
        `<p>Your complaint has been resolved.</p><p>Response: ${response}</p>`
      );
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }
    
    res.status(200).json({ message: 'Complaint resolved successfully', complaint });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};