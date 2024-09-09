const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// Register admin
router.post('/register', async (req, res) => {
    const { name,email, password } = req.body;

    try {
        // Check if the admin already exists
        const existingAdmin = await prisma.admin.findUnique({ where: { email } });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash the password and save the admin
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await prisma.admin.create({
            data: { name,email, password: hashedPassword }
        });

        res.status(201).json({ message: 'Admin registered successfully', admin });
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the admin
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check the password
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token (optional)
        const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token:token });
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
