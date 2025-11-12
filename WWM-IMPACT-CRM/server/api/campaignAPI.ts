// import express from 'express';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// const router = express.Router();

// //creeate campaign
// router.post('/campaigns', async (req, res) => {
//   const { name, goal, startDate, endDate, isActive } = req.body || {};

//   // name is the only required field
//   if (!name) {
//     return res.status(400).json({ error: 'Missing required field: name' });
//   }

//   try {
//     const newCampaign = await prisma.campaign.create({
//       data: {
//         name,
//         goal: goal || null,
//         startDate: startDate ? new Date(startDate) : null,
//         endDate: endDate ? new Date(endDate) : null,
//         isActive: isActive !== undefined ? isActive : true,
//       },
//     });

//     res.status(201).json(newCampaign);
//   } catch (error: any) {
//     console.error('Prisma error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// //get all campaigns
// router.get('/campaigns', async (req, res) => {
//   try {
//     const campaigns = await prisma.campaign.findMany();
//     res.json(campaigns);
//   } catch (error: any) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch campaigns' });
//   }
// });

// //get campaign by id
// router.get('/campaigns/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const campaign = await prisma.campaign.findUnique({
//       where: { id },
//     });
//     if (campaign) {
//       res.json(campaign);
//     } else {
//       res.status(404).json({ error: 'Campaign not found' });
//     }
//   } catch (error: any) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch campaign' });
//   }
// });

// //update campaign
// router.put('/campaigns/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name, goal, startDate, endDate, isActive } = req.body || {};
  
//   try { 
//     const updatedCampaign = await prisma.campaign.update({
//         where: { id },
//         data: {
//             name,
//             goal: goal || null,
//             startDate: startDate ? new Date(startDate) : null,
//             endDate: endDate ? new Date(endDate) : null,
//             isActive,
//         },
//     });
//     res.json(updatedCampaign);
//   } catch (error: any) {
//     console.error('Prisma error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// //delete campaign by id
// router.delete('/campaigns/:id', async (req, res) => {
//   const { id } = req.params;
//     try {
//         await prisma.campaign.delete({
//             where: { id },
//         });
//         res.status(204).send();
//     } catch (error: any) {
//         console.error('Prisma error:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// //delete all campaigns
// router.delete('/campaigns', async (req, res) => {
//     try {
//         await prisma.campaign.deleteMany({});
//         res.status(204).send();
//     } catch (error: any) {
//         console.error('Prisma error:', error);
//         res.status(500).json({ error: error.message });
//     }
// });


// export default router;