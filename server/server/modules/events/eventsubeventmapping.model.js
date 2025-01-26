const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/dataBase');
const Event = require('./events.model');
const Subevent = require('./subevents.model');

const EventSubeventMapping = sequelize.define(
  'EventSubeventMapping',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subevent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'EventSubeventMapping',
    timestamps: false,
  }
);

// Define Many-to-Many Associations
Event.belongsToMany(Subevent, {
  through: EventSubeventMapping,
  foreignKey: 'event_id',
  as: 'subevents',
});
Subevent.belongsToMany(Event, {
  through: EventSubeventMapping,
  foreignKey: 'subevent_id',
  as: 'events',
});

module.exports = EventSubeventMapping;
