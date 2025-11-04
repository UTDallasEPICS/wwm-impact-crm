// server.ts
import express from 'express';

import bodyParser from 'body-parser';
import reportAPI from './reportAPI'; 
import campaignAPI from './campaignAPI';


const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api', reportAPI);

app.use(bodyParser.json());
app.use('/api', campaignAPI);

app.get('/', (req, res) => {
  res.send('API is working!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




