const router = require('express').Router();
const controllers = require('./controllers');

router.get('/all', controllers.getProducts);
router.get('/one/:productId', controllers.getProduct);
router.post('/create', controllers.createProduct);
router.post('/update/:productId', controllers.updateProduct);
router.delete('/delete/:productId', controllers.deleteProduct);

module.exports = router;
