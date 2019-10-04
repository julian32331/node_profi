var mongoose = require('mongoose');

var settingSchema = mongoose.Schema({
    userID: String,
    daily: {
        type: Boolean,
        default: true
    },
    twopacks: {
        type: Boolean,
        default: true
    },
    regular: {
        type: Boolean,
        default: true
    },
    notification_daily: {
        type: Boolean,
        default: true
    },
    notification_totaltickets: {
        type: Boolean,
        default: false
    },
    notification_minPrice: {
        type: Boolean,
        default: true
    },
    notification_totalticketsreach: {
        type: Boolean,
        default: true
    },
    notification_maxPrice: {
        type: Boolean,
        default: false
    }
}, {
        timestamps: {
            createdAt: 'created_at'
        }
    });

module.exports = mongoose.model('settingModel', settingSchema);