const router = require('express').Router();
const controllers = require('./controllers');
const { isAuthorized, isAdmin } = require('../../helpers.');

router.get('/all', controllers.getProducts);
router.get('/one/:productId', controllers.getProduct);
router.post('/create', isAuthorized, isAdmin, controllers.createProduct);
router.post('/update/:productId', isAuthorized, isAdmin, controllers.updateProduct);
router.delete('/delete/:productId', isAuthorized, isAdmin, controllers.deleteProduct);

module.exports = router;
