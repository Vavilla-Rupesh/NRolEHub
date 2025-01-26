const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/dataBase');
const Event = require('./events.model');
const Subevent = require('./subevents.model');
const PaymentDetails = require('../payments/payment.model');

const StudentRegistration = sequelize.define(
  'StudentRegistration',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    event_name:{
      type: DataTypes.STRING,
      allowNull: true
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      }
    },
    subevent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Subevents',
        key: 'id'
      }
    },
    registration_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    student_name:{
      type: DataTypes.STRING,
      allowNull: true
    },
    student_contact:{
      type: DataTypes.STRING,
      allowNull: true
    },
    student_email:{
      type: DataTypes.STRING,
      allowNull: true
    },
    payment_status: {
      type: DataTypes.ENUM('paid', 'pending', 'failed'),
      defaultValue: 'pending',
      allowNull: false,
    },
    razorpay_order_id: {
      type: DataTypes.STRING,
      allowNull:true,
    },
    razorpay_payment_id: {
      type: DataTypes.STRING,
      allowNull:true,
    },
    attendance: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'Student_Registrations',
    timestamps: false,
  }
);

// Define associations
Event.hasMany(StudentRegistration, { foreignKey: 'event_id', onDelete: 'CASCADE' });
StudentRegistration.belongsTo(Event, { foreignKey: 'event_id' });

Subevent.hasMany(StudentRegistration, { foreignKey: 'subevent_id', onDelete: 'CASCADE' });
StudentRegistration.belongsTo(Subevent, { foreignKey: 'subevent_id' });

PaymentDetails.belongsTo(StudentRegistration, { foreignKey: 'registration_id' });
StudentRegistration.hasMany(PaymentDetails, { foreignKey: 'registration_id' });

module.exports = StudentRegistration;