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

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT){
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if(err) {
				return reject(err);
			}

			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			})
		})
	})
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
}