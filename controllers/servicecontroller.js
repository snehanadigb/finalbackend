const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const sendEmail = require('../utils/emailservice');

// Fetch all customers whose documents are pending verification
const getPendingCustomers = async (req, res) => {
    try {
        const getPendingCustomers = await prisma.customer.findMany({
            where: {
                documents: {
                    none: {} // This will find customers without any associated documents
                }
            },
            include: {
                services: true // Optionally include services or any other related data
            }
        });
        res.status(200).json(getPendingCustomers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve customers without documents', error });
    }
};


// Fetch all customers whose documents are verified
const getVerifiedCustomers = async (req, res) => {
    try {
        const verifiedCustomers = await prisma.customer.findMany({
            where: {
                AND: [
                    {
                        documents: {
                            some: {
                                verificationStatus: 'Verified'
                            }
                        }
                    },
                    {
                        services: {
                            some: {
                                isActive: false
                            }
                        }
                    }
                ]
            },
            include: {
                documents: true,
                services: true
            }
        });
        res.status(200).json(verifiedCustomers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve verified customers', error });
    }
};

const getActivatedCustomers = async (req, res) => {
    try {
        const verifiedCustomers = await prisma.customer.findMany({
            where: {
                services: {
                    some: {
                        isActive: true
                    }
                }
            },
            include: {
                documents: true,
                services: true
            }
        });
        res.status(200).json(verifiedCustomers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve verified customers', error });
    }
};

// Fetch all services
const getAllServices = async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            include: {
                customer: true // Include customer details in the response
            }
        });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve services', error });
    }
};

// Select a service for a customer
const selectService = async (req, res) => {
    const { serviceName, customerId } = req.body;
    try {
        const service = await prisma.service.create({
            data: {
                name: serviceName,
                customerId: parseInt(customerId)
            }
        });

        res.status(201).json({ message: 'Service selected successfully', service });
    } catch (error) {
        res.status(500).json({ message: 'Service selection failed', error });
    }
};

// Activate a service for a customer
const activateService = async (req, res) => {
    const { serviceId } = req.body;

    try {
        const service = await prisma.service.update({
            where: { id: parseInt(serviceId) },
            data: { isActive: true }
        });

        const customer = await prisma.customer.findUnique({ where: { id: service.customerId } });
        await sendEmail(customer.email, 'Service Activation', 'Your service has been successfully activated.');

        res.status(200).json({ message: 'Service activated successfully', service });
    } catch (error) {
        res.status(500).json({ message: 'Service activation failed', error });
    }
};

module.exports = { getPendingCustomers, getVerifiedCustomers,getActivatedCustomers, getAllServices, selectService, activateService };
