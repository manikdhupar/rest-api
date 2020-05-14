const express = require('express');

const dotenv = require('dotenv');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');


const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;
const dbURI = process.env.URI;

app.use(bodyParser.json());

app.use('/api/user', apiRoutes);
app.use('/api/user', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello');
})

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    res.status(status).json(error);
});

mongoose
    .connect(dbURI, {
        useNewUrlParser: true
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log('server started');
        });
    })
    .catch(err => {
        console.log(err);
    });