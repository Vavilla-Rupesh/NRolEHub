const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/dataBase')

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    event_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    venue: {
        type: DataTypes.TEXT
    },
    eligibility_criteria: {
        type: DataTypes.TEXT
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nature_of_activity: {
        type: DataTypes.ENUM(
            'CEA/NSS/National Initiatives (OLD)',
            'Sports & Games',
            'Cultural Activities',
            'Women\'s forum activities',
            'Hobby clubs Activities',
            'Professional society Activities',
            'Dept. Students Association Activities',
            'Technical Club Activities',
            'Innovation and Incubation Cell Activities',
            'Professional Self Initiatives',
            'Others'
        ),
        allowNull: false
    },
    iqac_reference: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    event_image: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('event_image');
            // Update the path to include /uploads prefix
            return rawValue ? `/uploads/events/${rawValue}` : null;
        }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Events',
    timestamps: false
});

module.exports = Event;