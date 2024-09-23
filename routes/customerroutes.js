const express = require('express');
const router = express.Router();
const  getCustomerByEmail  = require('../controllers/customercontroller');
const authenticateJWT=require('../middleware/authMiddleware');

// Route to get customer details by email
router.get('/email/:email',authenticateJWT, getCustomerByEmail);

module.exports = router;
