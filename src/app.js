const express = require('express');
const producerRoutes = require('./routes/producerRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.use('/producers', producerRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app; 