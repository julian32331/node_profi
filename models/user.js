var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    name: { type: String, default: '' },
    userID: String,
    token: {},
    avatar: { type: String, default: '' },
    active: {
        type: Number,
        default: 0
    }
}, { timestamps: { createdAt: 'created_at' } });

// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.generateToken = function () {
    return bcrypt.hashSync(Date.now, bcrypt.genSaltSync(8), null);
}

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
