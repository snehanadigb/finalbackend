const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const sendEmail = require('../utils/emailservice');
const createPlan = async (req, res) => {
    const { name, description, price, servicesIncluded ,planType} = req.body;
    //console.log(servicesIncluded);
    //price=parseFloat(price);
    try {
        const parsedPrice = parseFloat(price)
      const newPlan = await prisma.plan.create({
        data: {
          name,
          description,
          price:parsedPrice,
          servicesIncluded,
          planType
        },
      });
      res.status(201).json({ message: 'Plan created successfully', plan: newPlan });
    } catch (error) {
        console.error('Error creating plan:', error);
        res.status(500).json({ message: 'Failed to create plan', error: error.message });
      }
  };
  const getPlan = async (req, res) =>{
  try {
    const plans = await prisma.plan.findMany();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch plans' });
  }
  };
const getPlanById = async (req, res) => {
    const { planId } = req.params;
  
    try {
      const plan = await prisma.plan.findUnique({
        where: { id: parseInt(planId) },
      });
  
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
  
      res.json(plan);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch plan' });
    }
  };
// Fetch all customers whose documents are pending verification
// Fetch all customers whose documents are pending verification
const getPendingCustomers = async (req, res) => {
    const { search } = req.query; // Get the search query

    try {
        const pendingCustomers = await prisma.customer.findMany({
            where: {
                documents: {
                    none: {}
                },
                OR: search ? [
                    { first_name: { contains: search, mode: 'insensitive' } },
                    { last_name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ] : undefined // Apply the search filter if provided
            },
            include: {
                services: true
            }
        });
        res.status(200).json(pendingCustomers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve customers without documents', error });
    }
};

// Fetch all customers whose documents are verified
const getVerifiedCustomers = async (req, res) => {
    const { search } = req.query; // Get the search query

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
                    },
                    {
                        OR: search ? [
                            { first_name: { contains: search, mode: 'insensitive' } },
                            { last_name: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } }
                        ] : undefined // Apply the search filter if provided
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

// Fetch all activated customers
const getActivatedCustomers = async (req, res) => {
    const { search } = req.query; // Get the search query

    try {
        const activatedCustomers = await prisma.customer.findMany({
            where: {
                services: {
                    some: {
                        isActive: true
                    }
                },
                OR: search ? [
                    { first_name: { contains: search, mode: 'insensitive' } },
                    { last_name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ] : undefined // Apply the search filter if provided
            },
            include: {
                documents: true,
                services: true
            }
        });
        res.status(200).json(activatedCustomers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve activated customers', error });
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
    const { planId, customerId,name } = req.body;
    try {
        const service = await prisma.service.create({
            data: {
                name: name,
                customerId: parseInt(customerId),
                planId:parseInt(planId)
            }
        });

        res.status(201).json({ message: 'Service selected successfully', service });
    } catch (error) {
        res.status(500).json({ message: 'Service selection failed', error });
    }
};

// Activate a service for a customer
// Activate a service for a customer
const activateService = async (req, res) => {
    
    const { serviceId } = req.body;
    console.log(serviceId);

    try {
        // Fetch the service first
        const service = await prisma.service.update({
            where: { id: parseInt(serviceId) },
            data: { isActive: true }
        });

        // Fetch the plan associated with the service
        const plan = await prisma.plan.findUnique({
            where: { id: service.planId },
        });

        // Increment the count in the plans table (assuming you have a field called `count`)
        if (plan) {
            console.log(plan.id);
            await prisma.plan.update({
                where: { id: plan.id },
                data: { serviceActivatedCount: (plan.serviceActivatedCount|| 0) + 1 } // Increment count
            });
        }

        const customer = await prisma.customer.findUnique({ where: { id: service.customerId } });
        await sendEmail(customer.email, 'Service Activation', 'Your service has been successfully activated.');

        res.status(200).json({ message: 'Service activated successfully', service });
    } catch (error) {
        res.status(500).json({ message: 'Service activation failed', error });
    }
};
// In your backend (e.g., routes or controllers)
const logs =  async (req, res) => {
    const { search } = req.query;

    try {
        const logs = await prisma.document.findMany({
            where: {
                OR: [
                    {
                        customerId: {
                            in: await getCustomerIds(search)
                        }
                    },
                    {
                        verificationStatus: {
                            contains: search || '', // Default to empty string if search is empty
                        }
                    }
                ]
            },
            include: {
                customer: {
                    select: {
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                verificationDate: 'desc'
            }
        });
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Helper function to get customer IDs based on the search term
async function getCustomerIds(search) {
    if (!search) return [];

    const customers = await prisma.customer.findMany({
        where: {
            OR: [
                { first_name: { contains: search } },
                { last_name: { contains: search } },
                { email: { contains: search } }
            ]
        },
        select: { id: true }
    });

    return customers.map(customer => customer.id);
}

module.exports = {createPlan,getPlan,getPlanById, getPendingCustomers, getVerifiedCustomers,getActivatedCustomers, getAllServices, selectService, activateService ,logs};
