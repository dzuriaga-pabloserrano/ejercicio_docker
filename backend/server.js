//javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoUrl = 'mongodb://mongo:27017';
const dbName = 'messagesdb';
let db;

MongoClient.connect(mongoUrl)
  .then(client => {
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error(err));

app.get('/messages', async (req, res) => {
  const messages = await db.collection('messages').find().toArray();
  res.json(messages);
});

app.post('/messages', async (req, res) => {
  const message = req.body;
  await db.collection('messages').insertOne(message);
  res.status(201).json({ message: 'Mensaje guardado' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
});