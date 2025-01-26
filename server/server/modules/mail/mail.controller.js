const MailService = require('./mail.service');

exports.sendCertificate = async (req, res) => {
  const { email, pdfPath, name, eventName } = req.body;

  try {
    const result = await MailService.sendCertificate(email, pdfPath, name, eventName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendPasswordResetOTP = async (req, res) => {
  const { email } = req.body;

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    const result = await MailService.sendPasswordResetOTP(email, otp);
    res.status(200).json({ ...result, otp }); // Optionally include the OTP for testing
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
