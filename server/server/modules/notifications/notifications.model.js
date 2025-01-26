const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/dataBase')


const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    event_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subevent_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'sent', 'failed'),
        defaultValue: 'pending'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    sent_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'Notifications',
    timestamps: false
});

module.exports = Notification;
