require('dotenv').config();
require('./database/mongo');
const express = require('express');
const cors = require('cors')

const uploadRouter = require('./controller/upload');
const retrieveRouter = require('./controller/retrieve');
const connection = require('./database/mongo');

const app = express();

app.use(cors())

app.use(uploadRouter);
app.use(retrieveRouter);

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function gracefulShutdown() {
  server.close(async () => {
    console.log('Server is closed')


    await connection.close(false)
    console.log('Database is closed')

    console.log('Application terminated successfully')

    process.exit(0)
  })
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)