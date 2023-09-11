const router = require('express').Router();
const { validateSignIn } = require('../middlewares/validate');
const { login } = require('../controllers/users');

router.post('/', validateSignIn, login);

module.exports = router;
