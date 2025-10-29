  //This is creating a report rest api as ts base on the schema defined below
  
  /*
  id     String     @id @default(uuid())
  name   String
  type   ReportType @default(CUSTOM)
  config Json // filters/metrics stored here

  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  */

  //calling prisma client
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();

// Create an Express router
const router = express.Router();

// Create a new report
router.post('/reports', async (req: Request, res: Response) => {
  const { name, type, config, organizationId } = req.body;
  try {
    const newReport = await prisma.report.create({
      data: {
        name,
        type,
        config,
        organizationId,
      },
    });
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create report' });
  }
});

