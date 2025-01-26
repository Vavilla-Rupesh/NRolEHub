const AdminService = require('./admin.service');
const excel = require('exceljs');

exports.createEvent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Event image is required'
      });
    }

    const eventData = {
      ...req.body,
      event_image: req.file.filename,
      created_by: req.user.id
    };

    console.log('Creating event with data:', eventData);

    const event = await AdminService.createEvent(eventData);
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Failed to create event'
    });
  }
};

exports.getEventRegistrations = async (req, res) => {
  try {
    const registrations = await AdminService.getEventRegistrations(req.params.id);
    res.status(200).json(registrations);
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch registrations'
    });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    if (!req.params.registrationId) {
      return res.status(400).json({
        success: false,
        message: 'Registration ID is required'
      });
    }

    const present = req.body.present ?? true;
    const registration = await AdminService.markAttendance(req.params.registrationId, present);
    res.status(200).json({
      success: true,
      message: `Attendance marked as ${present ? 'present' : 'absent'} successfully`,
      registration
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to mark attendance'
    });
  }
};

exports.markBulkAttendance = async (req, res) => {
  try {
    const { eventId, subEventId } = req.params;
    const { present = false } = req.body;

    const registrations = await AdminService.markBulkAttendance(
      parseInt(eventId),
      parseInt(subEventId),
      present
    );

    res.status(200).json({
      success: true,
      message: `Bulk attendance marked as ${present ? 'present' : 'absent'} successfully`,
      registrations
    });
  } catch (error) {
    console.error('Bulk attendance error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update bulk attendance'
    });
  }
};

exports.exportRegistrations = async (req, res) => {
  try {
    const eventId = req.params.id;
    const registrations = await AdminService.getEventRegistrations(eventId);

    // Create a new workbook
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Registrations');

    // Add headers
    worksheet.columns = [
      { header: 'Registration ID', key: 'id', width: 15 },
      { header: 'Student Name', key: 'student_name', width: 30 },
      { header: 'Roll Number', key: 'roll_number', width: 15 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Semester', key: 'semester', width: 10 },
      { header: 'Mobile Number', key: 'mobile_number', width: 15 },
      { header: 'Email', key: 'student_email', width: 35 },
      { header: 'Sub Event', key: 'subevent_title', width: 30 },
      { header: 'Payment ID', key: 'razorpay_payment_id', width: 30 },
      { header: 'Payment Status', key: 'payment_status', width: 15 },
      { header: 'Attendance', key: 'attendance', width: 15 },
      { header: 'Certificate ID', key: 'certificate_id', width: 30 },
      { header: 'Registration Date', key: 'registration_date', width: 20 }
    ];

    // Process and add rows
    const rows = await Promise.all(registrations.map(async (reg) => {
      // Get user details
      const user = await AdminService.getUserDetails(reg.student_id);
      
      // Get subevent details
      const subevent = await AdminService.getSubeventDetails(reg.subevent_id);
      
      // Get certificate details
      const certificate = await AdminService.getCertificateDetails(reg.student_id, reg.event_id, reg.subevent_id);

      return {
        id: reg.id,
        student_name: reg.student_name,
        roll_number: user?.roll_number || 'N/A',
        year: user?.year || 'N/A',
        semester: user?.semester || 'N/A',
        mobile_number: user?.mobile_number || 'N/A',
        student_email: reg.student_email,
        subevent_title: subevent?.title || 'N/A',
        razorpay_payment_id: reg.razorpay_payment_id || 'N/A',
        payment_status: reg.payment_status,
        attendance: reg.attendance ? 'Present' : 'Absent',
        certificate_id: certificate?.certificate_id || 'N/A',
        registration_date: reg.registration_date
      };
    }));

    // Add rows to worksheet
    worksheet.addRows(rows);

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=event_${eventId}_registrations.xlsx`
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export registrations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to export registrations'
    });
  }
};

exports.getAllStudentRegistrations = async (req, res) => {
  try {
    const registrations = await AdminService.getAllStudentRegistrations();
    res.status(200).json(registrations);
  } catch (error) {
    console.error('Get student registrations error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch student registrations'
    });
  }
};