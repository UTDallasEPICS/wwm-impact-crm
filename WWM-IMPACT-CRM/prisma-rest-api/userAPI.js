//This is the User API file to handle user-related routes
//using express and prisma client
import express from 'express';
import { PrismaClient } from '@prisma/client';

//create a router
const router = express.Router();
//create a prisma client instance
const prisma = new PrismaClient();

//get all users
router.get('/users', async (req, res) => {
    
  try {
    //fetch all users from the database
    const users = await prisma.user.findMany();
    //return the users as json
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

//get user by id
router.get('/users/:id', async (req, res) => {
    //extract id from request parameters
  const { id } = req.params;
  try {
    //fetch user by id from the database
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    //return the user as json
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

//create a new user
router.post("/", async (req, res) => {
  try {
    //extract user data from request body
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


    //create a new user in the database
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

    //return the newly created user as json
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//update a user 
router.put('/users/:id', async (req, res) => {
    //extract id from request parameters
  const { id } = req.params;
  const { email, username, role } = req.body;
  try {
    //update the user in the database
    const updatedUser = await prisma.user.update({
        // specify the user to update
        where: { id: parseInt(id) },
        data: {  email,
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
        askAmounts, },
        });
        //return the updated user as json
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

//delete a user
router.delete('/users/:id', async (req, res) => {
    //extract id from request parameters
  const { id } = req.params;
  try {
    //delete the user from the database
    await prisma.user.delete({
        // specify the user to delete
      where: { id: parseInt(id) },
    });
    //return no content status
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

//export the router
export default router;