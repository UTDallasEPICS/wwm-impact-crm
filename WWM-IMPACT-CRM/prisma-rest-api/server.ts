// server.ts
import express from 'express';

import bodyParser from 'body-parser';
import reportAPI from './reportAPI'; // NO .ts here

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api', reportAPI);

app.get('/', (req, res) => {
  res.send('API is working!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




