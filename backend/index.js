const express = require('express');
const errorHandler = require('./middleware/errorHandler.js');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is working!');
});
app.use('/api/config', require('./routes/configRoutes.js'));
app.use('/api/parameters', require('./routes/parameterRoutes.js'));
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server started on ${port}`);
});






