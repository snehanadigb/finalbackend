const express = require('express');
const { createPlan,getPlan,getPlanById,getPendingCustomers,getVerifiedCustomers,getActivatedCustomers,getAllServices,selectService, activateService ,logs,statistics} = require('../controllers/servicecontroller');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/select-service', authenticateJWT, selectService);
router.post('/activate-service',  authenticateJWT,activateService);
router.get('/get-services',authenticateJWT,getAllServices);
router.get('/get-pending-customers',getPendingCustomers);
router.get('/get-verified-customers',authenticateJWT,getVerifiedCustomers);
router.get('/get-activated-customers',authenticateJWT,getActivatedCustomers);
router.post('/plans', createPlan);
router.get('/getplans',getPlan);
router.get('/getplans/:planId', getPlanById);
router.get('/get-document-verification-logs', authenticateJWT,logs);
router.get('/statistics',statistics);


module.exports = router;
