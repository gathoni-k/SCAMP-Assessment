const router = require('express').Router();

const controllers = require('./controllers');
const { isAuthorized } = require('../../helpers.');

router.get('/all', controllers.getOrders);
router.get('/one/:orderId', controllers.getOrder);
router.post('/create/:productName', isAuthorized, controllers.createOrder);
router.post('/update/:orderId', isAuthorized, controllers.updateOrder);
router.delete('/delete/:orderId', isAuthorized, controllers.deleteOrder);

module.exports = router;
