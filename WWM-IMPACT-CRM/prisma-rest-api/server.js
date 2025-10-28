//make a server.js file to start the express server and connect to the prisma client
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
//call the userAPI.js file to handle user routes
const userAPI = require('./userAPI');
app.use('/users', userAPI(prisma));

//start the server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});