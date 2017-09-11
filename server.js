const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const {PORT, DATABASE_URL} = require('./config');

const app = express();

app.use(bodyParser.json());
