const express = require('express');
const { getPendingCustomers,getVerifiedCustomers,getActivatedCustomers,getAllServices,selectService, activateService } = require('../controllers/servicecontroller');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/select-service', authenticateJWT, selectService);
router.post('/activate-service',  activateService);
router.get('/get-services',getAllServices);
router.get('/get-pending-customers',authenticateJWT,getPendingCustomers);
router.get('/get-verified-customers',authenticateJWT,getVerifiedCustomers);
router.get('/get-activated-customers',authenticateJWT,getActivatedCustomers);


module.exports = router;
