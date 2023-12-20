const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const {getFav} = require('./data/event');

const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

app.use(authRoutes);

app.use('/events', eventRoutes);

app.get('/favourites', async (req, res, next) => {
  try {
    const events = await getFav(req.query.userId);
    res.json({ events: events });
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong.';
  res.status(status).json({ message: message });
});

app.listen(8080);
