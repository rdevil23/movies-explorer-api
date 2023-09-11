const router = require('express').Router();
const signupRouter = require('./signup');
const signinRouter = require('./signin');
const auth = require('../middlewares/auth');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const { NotFoundError } = require('../errors/errors');

router.use('/signup', signupRouter);
router.use('/signin', signinRouter);

router.use(auth);

router.use('/users', usersRoutes);
router.use('/movies', moviesRoutes);

router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
