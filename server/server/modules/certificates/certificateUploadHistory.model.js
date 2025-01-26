const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/dataBase');

//create certificateuploadhistory model

const CertificateUploadHistory = sequelize.define('CertificateUploadHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    certificateId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    uploadDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    uploadStatus: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    uploadFileUrl: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    uploadFileStatus: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    uploadFileComment: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    tableName: 'certificateuploadhistory',
    timestamps: false
});
module.exports = CertificateUploadHistory;
