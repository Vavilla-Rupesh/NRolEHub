const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/dataBase');

const PaymentDetails = sequelize.define('payment_details', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  registration_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Student_Registrations',
      key: 'id',
    },
  },
  razorpay_order_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  razorpay_payment_id: {
    type: DataTypes.STRING(50),
    allowNull: true, // Nullable until payment is completed
  },
  razorpay_signature: {
    type: DataTypes.STRING(255),
    allowNull: true, // Nullable until payment is verified
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  payment_status: {
    type: DataTypes.ENUM('success', 'failed', 'pending'),
    allowNull: false,
    defaultValue: 'pending',
  },
  payment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'payment_details',
  timestamps: false, // Set true if you need `created_at` and `updated_at`
});

module.exports = PaymentDetails;
