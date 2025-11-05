import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /funds - create a new fund
router.post('/funds', async (req, res) => {
  try {
    const { name, isActive, isDefault, organizationId } = req.body;

    // Basic validation
    if (!name || !organizationId) {
      return res.status(400).json({ error: 'Name and organizationId are required' });
    }

    const fund = await prisma.fund.create({
      data: {
        name,
        isActive: isActive !== undefined ? isActive : true,      // default true
        isDefault: isDefault !== undefined ? isDefault : false,  // default false
        organization: {
          connect: { id: organizationId },  // connect to existing organization
        },
      },
    });

    res.status(201).json(fund);
  } catch (error: any) {
    console.error('Error creating fund:', error);
    res.status(500).json({ error: 'Failed to create fund' });
  }
});

// GET /funds - retrieve all funds
router.get('/funds', async (req, res) => {
  try {
    const funds = await prisma.fund.findMany();
    res.json(funds);
  } catch (error: any) {
    console.error('Error fetching funds:', error);
    res.status(500).json({ error: 'Failed to fetch funds' });
  }
});

// GET /funds/:id - 
// retrieve a fund by ID
router.get('/funds/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const fund = await prisma.fund.findUnique({
      where: { id },
    });
    if (fund) {
      res.json(fund);
    } else {
      res.status(404).json({ error: 'Fund not found' });
    }
  } catch (error: any) {
    console.error('Error fetching fund:', error);
    res.status(500).json({ error: 'Failed to fetch fund' });
  }
});

// PUT /funds/:id - update a fund by ID
router.put('/funds/:id', async (req, res) => {
  const { id } = req.params;
  const { name, isActive, isDefault } = req.body;

  try {
    const existingFund = await prisma.fund.findUnique({
      where: { id },
    });

    if (!existingFund) {
      return res.status(404).json({ error: 'Fund not found' });
    }

    const updatedFund = await prisma.fund.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(isDefault !== undefined ? { isDefault } : {}),
      },
    });

    res.json(updatedFund);
  } catch (error: any) {
    console.error('Error updating fund:', error);
    res.status(500).json({ error: 'Failed to update fund' });
  }
});

// DELETE /funds/:id - delete a fund by ID
router.delete('/funds/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const existingFund = await prisma.fund.findUnique({
      where: { id },
    });

    if (!existingFund) {
      return res.status(404).json({ error: 'Fund not found' });
    }

    await prisma.fund.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting fund:', error);
    res.status(500).json({ error: 'Failed to delete fund' });
  }
});


export default router;
