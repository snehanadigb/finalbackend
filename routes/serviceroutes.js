const express = require('express');
const { createPlan,getPlan,getPlanById,getPendingCustomers,getVerifiedCustomers,getActivatedCustomers,getAllServices,selectService, activateService ,logs} = require('../controllers/servicecontroller');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/select-service', authenticateJWT, selectService);
router.post('/activate-service',  activateService);
router.get('/get-services',getAllServices);
router.get('/get-pending-customers',getPendingCustomers);
router.get('/get-verified-customers',getVerifiedCustomers);
router.get('/get-activated-customers',getActivatedCustomers);
router.post('/plans', createPlan);
router.get('/getplans',getPlan);
router.get('/getplans/:planId', getPlanById);
router.get('/get-document-verification-logs', logs);


module.exports = router;
