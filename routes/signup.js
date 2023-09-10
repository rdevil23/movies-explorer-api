const router = require('express').Router();
const { validateSignUp } = require('../middlewares/validate');
const { createUser } = require('../controllers/users');

router.post('/', validateSignUp, createUser);

module.exports = router;
