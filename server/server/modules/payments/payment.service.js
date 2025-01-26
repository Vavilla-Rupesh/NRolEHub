const PaymentDetails = require('./payment.model');
const Student_Registrations = require('../events/studentRegistration.model');
const { sendReceiptEmail } = require('../../utils/mailer');
const verifyPaymentSignature = require('../../utils/paymentSignature');
const Razorpay = require('razorpay');
const { sequelize } = require('../../config/dataBase');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const updatePaymentStatus = async (orderId, status, paymentData = null, transaction) => {
  const updates = { payment_status: status };
  if (paymentData) {
    updates.razorpay_payment_id = paymentData.razorpay_payment_id;
    updates.razorpay_signature = paymentData.razorpay_signature;
  }

  // Update payment details
  await PaymentDetails.update(updates, {
    where: { razorpay_order_id: orderId },
    transaction
  });

  // Update student registration
  await Student_Registrations.update(
    { 
      payment_status: status === 'success' ? 'paid' : 'failed',
      razorpay_payment_id: paymentData?.razorpay_payment_id
    },
    { 
      where: { razorpay_order_id: orderId },
      transaction 
    }
  );
};

exports.createPayment = async (orderData) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Check for existing pending registration
    let registration = await Student_Registrations.findOne({
      where: {
        student_id: orderData.student_id,
        event_id: orderData.event_id,
        subevent_id: orderData.subevent_id,
        payment_status: 'pending'
      },
      transaction
    });

    if (!registration) {
      // Create new registration if none exists
      registration = await Student_Registrations.create({
        student_id: orderData.student_id,
        event_id: orderData.event_id,
        subevent_id: orderData.subevent_id,
        student_name: orderData.student_name,
        student_email: orderData.student_email,
        event_name: orderData.event_name,
        payment_status: 'pending'
      }, { transaction });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: orderData.amount,
      currency: 'INR',
      receipt: `rcpt_${registration.id}`
    });

    // Update registration with order ID
    await registration.update(
      { razorpay_order_id: order.id },
      { transaction }
    );

    // Delete any existing pending payment records
    await PaymentDetails.destroy({
      where: {
        registration_id: registration.id,
        payment_status: 'pending'
      },
      transaction
    });

    // Create new payment record
    await PaymentDetails.create({
      registration_id: registration.id,
      amount: orderData.amount,
      razorpay_order_id: order.id,
      payment_status: 'pending'
    }, { transaction });

    await transaction.commit();

    return {
      order_id: order.id,
      key: process.env.RAZORPAY_KEY_ID
    };
  } catch (error) {
    await transaction.rollback();
    console.error("Payment creation error:", error);
    throw error;
  }
};

exports.verifyPayment = async (paymentData) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Find registration by order ID
    const registration = await Student_Registrations.findOne({
      where: { razorpay_order_id: paymentData.razorpay_order_id },
      transaction
    });

    if (!registration) {
      throw new Error('Registration not found');
    }

    // Verify signature
    const isValidSignature = verifyPaymentSignature(paymentData, process.env.RAZORPAY_KEY_SECRET);
    if (!isValidSignature) {
      await updatePaymentStatus(paymentData.razorpay_order_id, 'failed', null, transaction);
      await transaction.commit();
      throw new Error('Invalid payment signature');
    }

    // Update payment status
    await updatePaymentStatus(paymentData.razorpay_order_id, 'success', paymentData, transaction);

    await transaction.commit();

    // Send receipt email
    await sendReceiptEmail(
      registration.student_email,
      'Payment Receipt',
      `Payment successful for ${registration.event_name}`
    );

    return {
      success: true,
      message: 'Payment verified successfully',
      registration_id: registration.id
    };
  } catch (error) {
    await transaction.rollback();
    console.error('Payment verification error:', error);
    throw error;
  }
};