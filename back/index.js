const express = require('express');
const app = express();
const cors = require('cors')
const Router = require('./routes/dateRoutes')
const PORT = 4000;

app.use(cors())

app.use('/graph',Router)

app.listen(PORT);
 
