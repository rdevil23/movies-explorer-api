const router = require('express').Router();
const { validateEditUserData } = require('../middlewares/validate');
const { getUserInfo, editUserData } = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch('/me', validateEditUserData, editUserData);

module.exports = router;
