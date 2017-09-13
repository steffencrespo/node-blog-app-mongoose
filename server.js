const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

const app = express();
const {Post} = require('./models');

app.use(bodyParser.json());

app.get('/posts', (req, res) => {
	Post.find()
		.limit(10)
		.then(posts => {
			res.json({
				post: posts.map(
					(post) => post.apiRepr())
			});
		})
		.catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'Internal Server Error'});
			});
});

app.get('/posts/:id', (req, res) => {
	Post.findById(req.params.id)
		.then(post => res.json(post.apiRepr()))
		.catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'Internal Server Error'})
			});
});


app.post('/posts', (req, res) => {
	let requiredParams = ['title', 'content', 'firstName', 'lastName'];

	for(let i = 0; i < requiredParams.length; i++) {
		const field = requiredParams[i];

		if(!(field in req.body)) {
			const message = `Field ${field} is missing from the request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	
	Post
	.create({
		title: req.body.title,
		content: req.body.content,
		author: {
			firstName: req.body.firstName,
			lastName: req.body.lastName
		}})
	.then(
		post => res.status(201).json(post.apiRepr()))
	.catch(err => {
		console.error(err);
		res.status(500).json({message: 'Internal Server Error'});
	});
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
			});
		});
	});
}

function stopServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
			resolve();
			});
		});
	});

}

if (require.main === module) {
	runServer().catch(err => console.error(err));
}