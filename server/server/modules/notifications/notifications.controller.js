const NotificationsService = require('./notifications.service');

exports.createNotification = async (req, res) => {
  try {
    const notification = await NotificationsService.createNotification(req.body);
    res.status(201).json({ message: 'Notification created', notification });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const response = await NotificationsService.sendNotification(req);
    res.status(200).json({ message: 'Notification sent successfully', response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
