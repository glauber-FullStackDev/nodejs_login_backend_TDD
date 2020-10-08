const routes = require('express').Router();
const SessionController = require('./app/controllers/SessionController');
const authMiddleware = require('./app/middlewares/auth');

// Rotas Authentication -- Login and change password
routes.post('/sessions', SessionController.store);
routes.post('/sessions/change-password', SessionController.changePassword);
routes.post('/sessions/change-password/confirm', authMiddleware, SessionController.confirmChangePassword);

// Rotas Register -- Register

//Private Routes -- General

routes.get('/dashboard', authMiddleware, (req, res) => {
    res.status(200).send({});
})

module.exports = routes;