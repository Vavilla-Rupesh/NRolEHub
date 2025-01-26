const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/dataBase');
const User = require('../auth/auth.model');

const Complaint = sequelize.define('Complaint', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    complaint_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'resolved'),
        defaultValue: 'pending'
    },
    admin_response: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    resolved_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'Complaints',
    timestamps: false
});

// Define associations
Complaint.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

module.exports = Complaint;