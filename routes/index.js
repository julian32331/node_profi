var express = require('express');
var router = express.Router();
var passport = require('passport');
var mainController = require('../controllers/mainController');
var main = new mainController();

router.get('/', isLoggedIn, main.index)
router.get('/login', main.login)
router.get('/landing', main.landing)
router.get('/users', isLoggedIn, main.usersPage)
router.get('/invitation', isLoggedIn, main.invitationPage)
router.post('/invitation', isLoggedIn, main.invitation)
router.get('/setting', isLoggedIn, main.settingPage)
router.post('/setting/changePassword', isLoggedIn, main.changePassword)
router.get('/removeEvent/:eventID', isLoggedIn, main.removeEvent)
router.get('/action/:mode/:userID', isLoggedIn, main.doaction)
router.get('/getPermission/:userID', isLoggedIn, main.getPermission)
router.post('/updatePermission/:userID', isLoggedIn, main.updatePermission)
router.get('/user/:userID', isLoggedIn, main.userDetailPage);

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  res.redirect('/login');
});
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup',
  failureFlash: true
}));

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/landing');
  }
}

module.exports = router;
