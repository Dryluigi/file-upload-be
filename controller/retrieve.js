const express = require('express');
const { GridFSBucket } = require('mongodb');
const { connection } = require('mongoose');

const retrieveRouter = express.Router();

retrieveRouter.get('/file/:filename', (req, res) => {
  const gfsBucket = new GridFSBucket(connection.db, {
    bucketName: 'uploads',
  });

  const fileStream = gfsBucket.openDownloadStreamByName(req.params.filename);

  fileStream.on('error', (error) => {
    console.error(error);
    return res.status(404).send('File not found');
  });

  fileStream.pipe(res);
});

module.exports = retrieveRouter;
