const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/dataBase');
const User = require('../auth/auth.model');
const Event = require('../events/events.model');
const Subevent = require('../events/subevents.model');

const Certificate = sequelize.define(
  'Certificate',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: 'id',
      },
    },
    subevent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subevent,
        key: 'id',
      },
    },
    certificate_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issued_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'Certificates',
    timestamps: false,
  }
);

Certificate.belongsTo(Event, { foreignKey: 'event_id' });
Certificate.belongsTo(Subevent, { foreignKey: 'subevent_id' });
module.exports = Certificate;