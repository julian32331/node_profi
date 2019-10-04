// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var tm_ticketsSchema = mongoose.Schema({
  eventID: String,
  userIDs: [],
  userID: {
    type: String,
    default: ''
  },
  regularMode: {
    type: Number,
    default: 1
  },
  timestamp: Number,
  date: {
    type: String,
    default: null
  },
  ticketinfo: {}
}, {
    timestamps: {
      createdAt: 'created_at'
    }
  });

// create the model for transaction and expose it to our app
module.exports = mongoose.model('tm_ticketsModel', tm_ticketsSchema);