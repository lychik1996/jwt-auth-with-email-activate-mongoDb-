const express = require('express');

const userControler = require('../controllers/user-controller');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middlewares');

router.post(
  '/registartion',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  userControler.registartion
);
router.post('/login', userControler.login);
router.post('/logout', userControler.logout);
router.get('/activate/:link', userControler.activate); //for activate with email
router.get('/refresh', userControler.refresh);
router.get('/users',authMiddleware, userControler.getUsers);
module.exports = router;
