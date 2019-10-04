var mongoose = require('mongoose');

var eventsSchema = mongoose.Schema({
    eventID: String,
    source: String,
    eventinfo: {},
    UTCEventDate: Date,
    active: {
        type: Boolean,
        default: true
    },
    counts: {
        type: Number,
        default: 0
    }
}, {
        timestamps: {
            createdAt: 'created_at'
        }
    });

module.exports = mongoose.model('eventsModel', eventsSchema);