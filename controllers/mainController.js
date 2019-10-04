var nodemailer = require('nodemailer');
var shortid = require('shortid');
var ejs = require('ejs');
var User = require('../models/user');
var Admin = require('../models/admin');
var eventsModel = require('../models/events');
var user_eventsModel = require('../models/user_events');
var settingModel = require('../models/setting');
var sh_ticketsModel = require('../models/sh_tickets');
var tm_ticketsModel = require('../models/tm_tickets');
var user_permissionsModel = require('../models/user_permissions');

class mainController {
    constructor() { }

    async index(req, res) {
        let users = [], tm_events = [], sh_events = []
        let Users = await User.find({})
        if (Users) users = Users
        let Tm_events = await eventsModel.find({ source: 'tm' })
        if (Tm_events) tm_events = Tm_events
        let Sh_events = await eventsModel.find({ source: 'sh' })
        if (Sh_events) sh_events = Sh_events
        res.render('index', { users, tm_events, sh_events })
    }

    login(req, res) {
        res.render('login')
    }

    async usersPage(req, res) {
        let users = await User.find({})
        res.render('users', { users })
    }

    invitationPage(req, res) {
        res.render('invitation')
    }

    settingPage(req, res) {
        res.render('setting')
    }

    async changePassword(req, res) {
        let currentPassword = req.body.currentPassword
        let newPassword = req.body.newPassword
        let admin = await Admin.findOne({})
        if (admin.validPassword(currentPassword)) {
            admin.password = admin.generateHash(newPassword)
            await admin.save()
            res.status(200).json({ status: true })
        } else {
            res.status(200).json({ status: false, message: 'Current password is incorrect.' })
        }
    }

    async removeEvent(req, res) {
        let eventID = req.params.eventID
        await eventsModel.deleteOne({ eventID: eventID })
        await tm_ticketsModel.deleteMany({ eventID: eventID })
        await sh_ticketsModel.deleteMany({ eventID: eventID })
        res.send('ok');
    }

    async doaction(req, res) {
        let mode = req.params.mode
        let userID = req.params.userID
        if (mode == 3) {
            await User.deleteOne({ userID: userID })
            await user_eventsModel.deleteOne({ userID: userID })
            await settingModel.deleteOne({ userID: userID })
            await user_permissionsModel.deleteOne({ userID: userID })
        } else {
            let user = await User.findOne({ userID: userID })
            user.active = mode;
            await user.save()
            if (mode == 0) {
                var smtpTransport = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.MAIL_SERVER_USER,
                        pass: process.env.MAIL_SERVER_PASSWORD
                    }
                });
                let password = Math.random().toString(36).substring(7);
                user.password = user.generateHash(password)
                user.save()
                let senddata = {
                    email: user.email,
                    password: password,
                    siteURL: process.env.SITE_URL
                }
                ejs.renderFile(process.cwd() + "/views/invitation_email.ejs", { data: senddata }, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        let mailOptions = {
                            to: user.email,
                            subject: "Invitation to ticketdatamaster.com",
                            html: data
                        };
                        smtpTransport.sendMail(mailOptions, function (error, response) {
                            if (error) {
                                console.log('Cannot send email to ' + email)
                            } else {
                            }
                        });
                    }
                });
            }
        }
        res.send('ok')
    }

    async getPermission(req, res) {
        let userID = req.params.userID;
        let permission = await user_permissionsModel.findOne({ userID: userID });
        if (permission == null) {
            permission = new user_permissionsModel({ userID: userID });
            await permission.save();
        }
        permission = { daily: permission.daily, specified: permission.specified, maxEvents: permission.maxEvents, prediction: permission.prediction, compare: permission.compare };
        res.json({ permission })
    }

    async updatePermission(req, res) {
        let userID = req.params.userID;
        let permission = req.body;
        let daily = (permission.daily == 'on') ? true : false;
        let specified = (permission.specified == 'on') ? true : false;
        let prediction = (permission.prediction == 'on') ? true : false;
        let compare = (permission.compare == 'on') ? true : false;
        let maxEvents = parseInt(permission.maxEvents, 10);
        await user_permissionsModel.updateOne({ userID: userID }, { daily, specified, prediction, compare, maxEvents });
        res.json({ status: true });
    }

    async userDetailPage(req, res) {
        let userID = req.params.userID;
        let user_events = await user_eventsModel.findOne({ userID: userID });
        let sh_events = (user_events) ? user_events.sh_eventIDs : [];
        let tm_events = (user_events) ? user_events.tm_eventIDs : [];
        let renderData = { sh_events, tm_events };
        res.render('userDetail', renderData);
    }

    invitation(req, res) {
        let emailsbody = req.body.emails
        let emails = emailsbody.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);
        emails.forEach(email => {
            if (email) {
                email = email.toLowerCase();
                var smtpTransport = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.MAIL_SERVER_USER,
                        pass: process.env.MAIL_SERVER_PASSWORD
                    }
                });
                let password = Math.random().toString(36).substring(7);
                let senddata = {
                    email: email,
                    password: password,
                    siteURL: process.env.SITE_URL
                }
                ejs.renderFile(process.cwd() + "/views/invitation_email.ejs", { data: senddata }, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        let mailOptions = {
                            to: email,
                            subject: "Invitation to ticketdatamaster",
                            html: data
                        };
                        smtpTransport.sendMail(mailOptions, function (error, response) {
                            if (error) {
                                console.log('Cannot send email to ' + email)
                            } else {
                                User.findOne({ email: email }, (err, user) => {
                                    if (!user) {
                                        let nuser = new User();
                                        nuser.email = email;
                                        nuser.userID = shortid.generate()
                                        nuser.password = nuser.generateHash(password);
                                        nuser.save((error) => {
                                            if (!error) {
                                                console.log('new user has been saved.')
                                            }
                                            let setting = new settingModel()
                                            setting.userID = nuser.userID
                                            setting.save()

                                            //save permission
                                            let user_permissions = new user_permissionsModel({ userID: nuser.userID })
                                            user_permissions.save();
                                        })

                                    } else {
                                        user.password = user.generateHash(password);
                                        user.save((error) => {
                                            if (!error) {
                                                console.log('user: ' + email + ' has been updated.')
                                            }
                                        })
                                    }
                                })

                            }
                        });
                    }
                });
            }
        });
        res.send('ok')
    }
}

module.exports = mainController