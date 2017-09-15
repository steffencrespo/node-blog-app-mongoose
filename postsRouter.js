const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const {Post} = require('./models');

router.get('/', (req, res) => {
	Post.find()
		.limit(10)
		.then(posts => {
			res.status(200).json(
				posts.map(
					(post) => post.apiRepr())
			);
		})
		.catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'Internal Server Error'});
			});
});

router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then(post => res.json(post.apiRepr()))
		.catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'Internal Server Error'})
			});
});


router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
	if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		const message = (`Request path id ${req.params.id} and request body id ${req.body.id} must match`);
		console.error(message);
		return res.status(400).json({message: message});
	}

	const toUpdate = {};
	const updateableFields = ['title', 'content', 'firstName', 'lastName'];

	updateableFields.forEach(field => {
		if(field in req.body) {
			toUpdate[field] = req.body[field];
		}
	});

	Post
	.findByIdAndUpdate(req.body.id, {$set: toUpdate})
	.then(post => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal Server Error'}));
});

router.delete('/:id', (req, res) => {
	Post.findByIdAndRemove(req.params.id)
	.then(post => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal Server Error'}));
});

module.exports = router;