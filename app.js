const express = require('express');
const cors=require('cors');
const path=require('path');
const authRoutes = require('./routes/authroutes');
const documentcontroller = require('./controllers/documentcontroller');
const serviceRoutes = require('./routes/serviceroutes');
const customerRouter=require('./routes/customerroutes');
const adminRouter=require('./controllers/admincontroller');
//const authenticateJWT=require('../middleware/authmiddleware');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use('/documents', documentcontroller);
app.use('/customers', customerRouter)
app.use('/services', serviceRoutes);
app.use('/admin',adminRouter);

module.exports = app;
