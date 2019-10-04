var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var adminSchema = mongoose.Schema({
    username: String,
    password: String
}, { timestamps: { createdAt: 'created_at' } });

adminSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

adminSchema.methods.generateToken = function () {
    return bcrypt.hashSync(Date.now, bcrypt.genSaltSync(8), null);
}

adminSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
