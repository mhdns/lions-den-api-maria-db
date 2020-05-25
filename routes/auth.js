const express = require('express');
const {
  register, login, getMe, updateDetails, updatePassword, deleteUser, logout
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/getme').get(protect, getMe);
router.route('/updatedetails').put(protect, updateDetails);
router.route('/updatepassword').put(protect, updatePassword);
router.route('/deleteuser').delete(protect, deleteUser);
router.route('/logout').get(logout);

module.exports = router;
