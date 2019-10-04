var mongoose = require('mongoose');

var user_permissionsSchema = mongoose.Schema({
    userID: String,
    daily: {
        type: Boolean,
        default: true
    },
    specified: {
        type: Boolean,
        default: true
    },
    maxEvents: {
        type: Number,
        default: 10
    },
    prediction: {
        type: Boolean,
        default: true
    },
    compare: {
        type: Boolean,
        default: true
    }
}, {
        timestamps: {
            createdAt: 'created_at'
        }
    });

module.exports = mongoose.model('user_permissionsModel', user_permissionsSchema);