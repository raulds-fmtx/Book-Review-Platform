const router = require('express').Router();
const checkoutRoutes = require('./checkout');

router.use('/checkout', checkoutRoutes);

module.exports = router;
