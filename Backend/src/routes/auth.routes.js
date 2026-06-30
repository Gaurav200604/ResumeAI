const { Router } = require('express');
const authRouter = Router();

const authMiddleware = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middlewares/ratelimit.middleware');
const { validate, registerSchema, loginSchema } = require('../middlewares/validate.middleware');

/**
 * @route POST /api/auth/register
 * @desc  Register a new user
 * @access Public
 */
authRouter.post('/register',
    authLimiter,
    validate(registerSchema),
    authController.registerUserController
);

/**
 * @route POST /api/auth/login
 * @desc  Login a user
 * @access Public
 */
authRouter.post('/login',
    authLimiter,
    validate(loginSchema),
    authController.loginUserController
);

/**
 * @route POST /api/auth/logout
 * @desc  Logout a user
 * @access Public
 */
authRouter.post('/logout', authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @desc  Get the current logged-in user
 * @access Private
 */
authRouter.get('/get-me',
    authMiddleware.authUser,
    authController.getMeController
);

module.exports = authRouter;
