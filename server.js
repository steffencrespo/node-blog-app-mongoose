const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const {PORT, DATABASE_URL} = require('./config');

const app = express();
const {Post} = require('./models');

app.use(bodyParser.json());

app.get('/posts', (req, res) => {

});

app.get('/posts/:id', (req, res) => {

});


app.post('/posts', (req, res) => {

});

app.post('/posts/:id', (req, res) => {

});

app.put('/posts/:id', (req, res) => {

});

app.delete('/posts/:id', (req, res) => {

});