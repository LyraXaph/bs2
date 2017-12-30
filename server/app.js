const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const boulderRoutes = require('./api/routes/boulders');
const gymRoutes = require('./api/routes/gyms');
const userRoutes = require('./api/routes/user');


// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });
// Connect to our Database and handle an bad connections
mongoose.connect(process.env.DATABASE, 
    {useMongoClient:true});
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

app.use(cors());
app.use(morgan('dev'));
app.use('/public/uploads', express.static('public/uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use('/boulders', boulderRoutes);
app.use('/gyms', gymRoutes);
app.use('/users', userRoutes);
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;