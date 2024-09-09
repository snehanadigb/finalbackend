const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCustomerByEmail = async (req, res) => {
  const { email } = req.params;
  console.log(email);
  try {
    // Fetch customer and related documents and services using relations
    const customer = await prisma.customer.findUnique({
      where: { email: email },
      include: {
        documents: true,  // Assuming 'documents' is the relation in your Prisma schema
        services: true    // Assuming 'services' is the relation in your Prisma schema
      }
    });

    if (customer) {
      res.status(200).json(customer);  // Return the customer details along with related data
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer details', error });
  }
};

module.exports =  getCustomerByEmail ;
