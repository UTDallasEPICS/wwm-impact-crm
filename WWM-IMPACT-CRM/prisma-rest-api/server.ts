// server.ts
import express from 'express';

import bodyParser from 'body-parser';
import reportAPI from './reportAPI'; 
import campaignAPI from './campaignAPI';
import fundAPI from './fundAPI';
import constituentsAPI from './constituentsAPI';



const app = express();
const PORT = Number(process.env.PORT || 3000);

//call report api
app.use(bodyParser.json());
app.use('/api', reportAPI);

//call campaign api
app.use(bodyParser.json());
app.use('/api', campaignAPI);

//call fund api
app.use(bodyParser.json());
app.use('/api', fundAPI);

//call constituents api
app.use(bodyParser.json());
app.use('/api', constituentsAPI);


app.get('/', (req, res) => {
  res.send('API is working!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




