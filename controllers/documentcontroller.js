const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const authenticateJWT = require('../middleware/authMiddleware');
//const authenticateJWT = require('../middleware/authmiddleware');

const prisma = new PrismaClient();
const router = express.Router();

// Configure multer storage for document upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Function to save document details to the database
const saveDocument = async (filePath, customerId) => {
    try {
        const document = await prisma.document.create({
            data: {
                filePath: filePath,
                customerId: parseInt(customerId),
                verificationStatus: 'Pending' // Initial status before verification
            }
        });
        return document;
    } catch (error) {
        console.error('Error saving document:', error);
        throw new Error('Document saving failed');
    }
};

// Function to send the document for Aadhaar verification
const verifyDocument = async (filePath) => {
    try {
        const response = await axios.post(`${process.env.OCR_URL}/extract`, {
            filePath: filePath
        });
        console.log(response.data.success);
        return response.data; // Response from Aadhaar verification service
    } catch (error) {
        console.error('Error during document verification:', error);
        throw new Error('Verification failed');
    }
};

// Route to handle document upload and initiate verification
// Route to handle document upload and initiate verification
router.post('/upload',authenticateJWT, upload.single('document'), async (req, res) => {
    try {
        const customerId = req.query.customerId;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;

        // Clear any previous failed status for this customer/document
        const existingDocument = await prisma.document.findFirst({
            where: { customerId: parseInt(customerId) }
        });

        if (existingDocument && existingDocument.verificationStatus === 'Failed') {
            await prisma.document.update({
                where: { id: existingDocument.id },
                data: { verificationStatus: 'Failed' } // Reset status before new upload
            });
        }

        const document = await saveDocument(filePath, customerId);

        // Send file to Aadhaar verification service
        const verificationResult = await verifyDocument(filePath);

        // Handle verification result
        if (verificationResult.success === true) {
            await prisma.document.update({
                where: { id: document.id },
                data: {
                    verificationStatus: 'Verified',
                    verificationDate: new Date(),
                }
            });
        } else if (verificationResult.success === false && verificationResult.message === 'No Aadhaar number found in the image') {
            // Update document status to 'Failed' if no Aadhaar number was found
            await prisma.document.update({
                where: { id: document.id },
                data: {
                    verificationStatus: 'Failed',
                    verificationDate: new Date(),
                }
            });
        
            return res.status(400).json({
                message: 'Document verification failed: No Aadhaar number found',
                verificationStatus: 'Failed'
            });
        } else {
            // Handle other verification failures
            await prisma.document.update({
                where: { id: document.id },
                data: {
                    verificationStatus: 'Failed',
                    verificationDate: new Date(),
                }
            });
        
            return res.status(400).json({
                message: 'Document verification failed',
                verificationStatus: 'Failed'
            });
        }
        
        res.status(201).json({
            message: 'Document uploaded successfully',
            verificationStatus: verificationResult.verificationResponse.status
        });
    } catch (error) {
        console.error('Error during document upload and verification:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
