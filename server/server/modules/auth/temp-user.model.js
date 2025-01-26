const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/dataBase');

const TempUser = sequelize.define('TempUser', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('student', 'admin'),
        allowNull: false
    },
    mobile_number: {
        type: DataTypes.STRING(15),
        allowNull: true,
        validate: {
            is: /^[0-9]{10}$/
        }
    },
    roll_number: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    college_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    stream: {
        type: DataTypes.STRING,
        allowNull: true
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 4
        }
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 8
        }
    },
    otp: {
        type: DataTypes.STRING(6),
        allowNull: false
    },
    otp_expires: {
        type: DataTypes.DATE,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'TempUsers',
    timestamps: false
});

module.exports = TempUser;