const express = require('express');

const userControllers = require('../controllers/user-controllers');
const {validateInputs} = require('../middlewares/validation-middleware')
const {loginSchema , signupSchema} = require('../validation-schemas/user-schemas')

const router = express.Router();

router.post('/signup',validateInputs(signupSchema),userControllers.signup);

router.post('/login',validateInputs(loginSchema),userControllers.login);

router.get('/profile/:userId',userControllers.getUserProfile);

module.exports = router;