require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to Database"))

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.json());
const indexRoutes = require('./routes/index');

app.use('/', indexRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => 
    console.log(`Server running on http://localhost:${port}`)
);
