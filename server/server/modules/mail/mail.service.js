const { sendEmailWithAttachment, sendOTP } = require('../../utils/mailer');

exports.sendCertificate = async (email, pdfPath, name, eventName) => {
  try {
    await sendEmailWithAttachment(email, pdfPath, name, eventName);
    return { message: `Certificate email sent to ${email}` };
  } catch (error) {
    throw new Error(`Failed to send certificate email: ${error.message}`);
  }
};

exports.sendPasswordResetOTP = async (email, otp) => {
  try {
    await sendOTP(email, otp);
    return { message: `OTP email sent to ${email}` };
  } catch (error) {
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};
