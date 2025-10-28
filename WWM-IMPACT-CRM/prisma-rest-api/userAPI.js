// This is the User API file to handle user-related routes
// Using Express and Prisma Client

import express from 'express';
import { PrismaClient } from '@prisma/client';

// Create a router instance
const router = express.Router();
// Create a Prisma client instance
const prisma = new PrismaClient();

// GET all users
router.get('/users', async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany();

    // Return the users as JSON
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});



// GET user by ID
router.get('/users/:id', async (req, res) => {
  // Extract id from request parameters
  const { id } = req.params;

  try {
    // Fetch user by id from the database
    // Note: id is a UUID (String), so no need for parseInt()
    const user = await prisma.user.findUnique({
      where: { id },
    });

    // Return the user as JSON
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});


// CREATE a new user
router.post('/users', async (req, res) => {
  try {
    // Extract user data from the request body
    const {
      email,
      username,
      password,
      role,
      accountNum,
      note,
      purpose,
      transactions,
      inbound,
      subject,
      channel,
      reasonForInterest,
      level,
      createdName,
      lastModifiedName,
      askAmounts,
    } = req.body;

    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password,
        role,
        accountNum,
        note,
        purpose,
        transactions,
        inbound,
        subject,
        channel,
        reasonForInterest,
        level,
        createdDate: new Date(),
        createdName,
        lastModifiedDate: new Date(),
        lastModifiedName,
        askAmounts,
      },
    });

    // Return the newly created user as JSON
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// UPDATE an existing user
router.put('/users/:id', async (req, res) => {
  // Extract id from request parameters
  const { id } = req.params;

  // Extract updated fields from the request body
  const {
    email,
    username,
    password,
    role,
    accountNum,
    note,
    purpose,
    transactions,
    inbound,
    subject,
    channel,
    reasonForInterest,
    level,
    lastModifiedName,
    askAmounts,
  } = req.body;

  try {
    // Update the user in the database
    const updatedUser = await prisma.user.update({
      // Specify the user to update
      where: { id },
      data: {
        email,
        username,
        password,
        role,
        accountNum,
        note,
        purpose,
        transactions,
        inbound,
        subject,
        channel,
        reasonForInterest,
        level,
        lastModifiedDate: new Date(), 
        lastModifiedName,
        askAmounts,
      },
    });

    // Return the updated user as JSON
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});



// DELETE a user
router.delete('/users/:id', async (req, res) => {
  // Extract id from request parameters
  const { id } = req.params;

  try {
    // Delete the user from the database
    await prisma.user.delete({
      // Specify the user to delete
      where: { id },
    });

    // Return no content status
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});



// Export the router
export default router;
