const StudentRegistrationsService = require('./studentRegistration.service');

// Register a student for an event
exports.registerForEvent = async (req, res) => {
  try {
    const registration = await StudentRegistrationsService.registerForEvent(req.body);
    res.status(201).json({ message: 'Registration successful', registration });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all registrations for the logged-in student
exports.getRegistrationsByStudent = async (req, res) => {
  try {
    const registrations = await StudentRegistrationsService.getRegistrationsByStudent(req.user.id);
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get registrations for a specific event (Admin-only)
exports.getRegistrationsByEvent = async (req, res) => {
  try {
    const registrations = await StudentRegistrationsService.getRegistrationsByEvent(req.params.eventId);
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
