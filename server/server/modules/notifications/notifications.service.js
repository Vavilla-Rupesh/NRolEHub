const Notification = require('./notifications.model');
const { sendNotificationMail } = require('../../utils/mailer');
const studentRegistrations = require('../events/studentRegistration.model')

exports.createNotification = async (notificationData) => {
  return Notification.create(notificationData);
};

exports.sendNotification = async (req) => {
  console.log(req.body);
  let successCount = 0;
  let failureCount = 0;

  const notification_id = req.body.notification_id
  const text = await Notification.findOne({ where: { id: notification_id , event_id: req.body.event_id, subevent_id: req.body.subevent_id} })
  console.log("Message: ", text.dataValues.message);
  const message = text.dataValues.message;

  const studentReg = await studentRegistrations.findAll({ where: { event_id: req.body.event_id, subevent_id: req.body.subevent_id, payment_status: 'paid'} });
  //send mail to each student

  for (i in studentReg) {
    try {
      const email = studentReg[i].dataValues.student_email; // Extract email
      await sendNotificationMail(
        email,
        'Notification from Campus Connect',
        '',
        `<p>${message}</p>`
      );
      console.log(`Notification sent successfully to ${email}`);
      successCount++;
    } catch (error) {
      console.error(`Error sending notification to ${studentReg[i].dataValues.student_email}:`, error.message);
      failureCount++;
    }
  }

  await Notification.update({ status: 'sent' , sent_at : Date.now()}, { where: { id:notification_id}})
  return { successCount, failureCount };
};
