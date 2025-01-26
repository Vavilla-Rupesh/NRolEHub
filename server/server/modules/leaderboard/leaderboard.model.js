const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/dataBase');
const User = require('../auth/auth.model');

const Leaderboard = sequelize.define('Leaderboard', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subevent_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rank: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Leaderboard',
    timestamps: false
});

// Define associations
Leaderboard.belongsTo(User, { 
    foreignKey: 'student_id',
    as: 'student'
});

module.exports = Leaderboard;