var mongoose = require('mongoose');

var user_eventsSchema = mongoose.Schema({
    userID: String,
    tm_eventIDs: [],
    tm_eventStartDates: [],
    tm_frequencies: [],
    sh_eventIDs: [],
    sh_eventStartDates: [],
    sh_frequencies: [],
    tf_eventIDs: [],
    tf_eventStartDates: []
}, {
        timestamps: {
            createdAt: 'created_at'
        }
    });

module.exports = mongoose.model('user_eventsModel', user_eventsSchema);