const express = require('express');
const router = express.Router();
const  getCustomerByEmail  = require('../controllers/customercontroller');
//const authenticateJWT=require('../middleware/authmiddleware')

// Route to get customer details by email
router.get('/email/:email', getCustomerByEmail);

module.exports = router;
