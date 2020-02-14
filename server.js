const express = require('express');
const routes = require('./server/api');
const path = require('path');

require('dotenv').config();

const app = express();
// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html

app.use(express.static(path.resolve(__dirname, './dist')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, "./src/client/index.html"));
});

app.use('/api', routes());

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, "./src/client/index.html"));
});

app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`)
  }
})

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  process.exit(1)
})
