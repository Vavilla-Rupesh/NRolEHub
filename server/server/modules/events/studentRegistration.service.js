const StudentRegistration = require('./studentRegistration.model');
const { sequelize } = require('../../config/dataBase');

exports.registerForEvent = async (registrationData) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Check for any existing registration (paid or pending)
    const existingRegistration = await StudentRegistration.findOne({
      where: { 
        student_id: registrationData.student_id, 
        event_id: registrationData.event_id,
        subevent_id: registrationData.subevent_id
      },
      transaction
    });

    if (existingRegistration) {
      // If there's a paid registration, prevent re-registration
      if (existingRegistration.payment_status === 'paid') {
        throw new Error('Already registered for this event');
      }
      
      // If there's a pending registration, update it instead of creating new
      await existingRegistration.update({
        student_name: registrationData.student_name,
        student_email: registrationData.student_email,
        event_name: registrationData.event_name,
        razorpay_order_id: null,
        razorpay_payment_id: null,
        payment_status: 'pending'
      }, { transaction });

      await transaction.commit();
      return existingRegistration;
    }

    // Create new registration if none exists
    const registration = await StudentRegistration.create({
      ...registrationData,
      payment_status: 'pending'
    }, { transaction });

    await transaction.commit();
    return registration;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.getRegistrationsByStudent = async (studentId) => {
  return StudentRegistration.findAll({ 
    where: { 
      student_id: studentId,
      payment_status: 'paid'  // Only return paid registrations
    } 
  });
};