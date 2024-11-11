const express = require('express');
const { Readable } = require('stream');
const multer = require('multer');
const connection = require('../database/mongo');
const { GridFSBucket } = require('mongodb');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadRouter = express.Router();

uploadRouter.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const gfsBucket = new GridFSBucket(connection.db, {
    bucketName: 'uploads',
  });

  const timestamp = Date.now();
  const originalName = req.file.originalname;
  const filename = `${originalName.split('.')[0]}_${timestamp}.${originalName.split('.').pop()}`;

  const fileStream = Readable.from(req.file.buffer);
  const uploadStream = gfsBucket.openUploadStream(filename);

  fileStream.pipe(uploadStream)
    .on('error', (error) => {
      console.error(error);
      res.status(500).send('Error uploading file');
    })
    .on('finish', () => {
      res.status(200).send('File uploaded successfully');
    });
});

module.exports = uploadRouter;
