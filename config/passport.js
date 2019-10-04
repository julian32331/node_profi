var LocalStrategy = require('passport-local').Strategy;
var Admin = require('../models/admin');

module.exports = function (passport) {
    passport.serializeUser(function (admin, done) {
        done(null, admin.id);
    });

    passport.deserializeUser(function (id, done) {
        Admin.findById(id, function (err, admin) {
            done(err, admin);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, username, password, done) {
            process.nextTick(function () {
                Admin.findOne({ 'username': username }, function (err, admin) {
                    if (err)
                        return done(err);
                    if (!admin)
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    if (!admin.validPassword(password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    else
                        return done(null, admin);
                });
            });

        }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, username, password, done) {

            process.nextTick(function () {
                if (!req.admin) {
                    Admin.findOne({ 'username': username }, function (err, admin) {
                        if (err)
                            return done(err);
                        if (admin) {
                            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                        } else {
                            var newAdmin = new Admin();
                            newAdmin.username = username;
                            newAdmin.password = newAdmin.generateHash(password);

                            newAdmin.save(function (err) {
                                if (err)
                                    return done(err);
                                return done(null, newAdmin);
                            });
                        }

                    });
                } else if (!req.admin.username) {
                    Admin.findOne({ 'username': username }, function (err, admin) {
                        if (err)
                            return done(err);

                        if (admin) {
                            return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                        } else {
                            var admin = req.admin;
                            admin.username = username;
                            admin.password = admin.generateHash(password);
                            admin.save(function (err) {
                                if (err)
                                    return done(err);
                                return done(null, admin);
                            });
                        }
                    });
                } else {
                }

            });

        }));
};
