// reportAPI.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();



// GET /api/reports - fetch all reports
router.get('/reports', async (req, res) => {
  try {
    const reports = await prisma.report.findMany();
    res.json(reports);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});


//create report
router.post('/reports', async (req, res) => {
  const { name, type, config, organizationId } = req.body || {};

  if (!name || !type || !organizationId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newReport = await prisma.report.create({
      data: {
        name,
        type, // must match enum exactly
        config,
        organizationId, // must exist
      },
    });
    res.status(201).json(newReport);
  } catch (error: any) {
    console.error('Prisma error:', error); // Log full error to terminal
    res.status(500).json({ error: error.message }); // Return actual error to Postman
  }
});

//update report
router.put('/reports/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, config } = req.body || {};
  try {
    const updatedReport = await prisma.report.update({
      where: { id },
      data: { name, type, config },
    });
    res.json(updatedReport);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message }); // now Postman sees the real error
  }
});

// DELETE /api/reports/:id - delete a report by ID
router.delete('/reports/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedReport = await prisma.report.delete({
      where: { id },
    });
    res.json(deletedReport);
  } catch (error: any) {
  console.error(error);
  res.status(500).json({ error: error.message }); // now Postman sees the real error
  }
});

export default router;
