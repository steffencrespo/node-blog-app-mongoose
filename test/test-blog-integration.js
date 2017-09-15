const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const should = chai.should();

const {Post} = require('../models');
const {runServer, app, stopServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function generatePostInput() {
	return {
		title: faker.lorem.words(),
		content: faker.lorem.paragraphs(),
		author: {
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName()
		}
	}
}

function generatePostInputForRequest() {
	let postInput = generatePostInput();
	return {
		title: postInput.title,
		content: postInput.content,
		firstName: postInput.author.firstName,
		lastName: postInput.author.lastName
	}
}

function seedData() {
	const posts = [];

	for (let i = 0; i <= 10; i++) {
		posts.push(generatePostInput());
	}
	
	return Post.insertMany(posts);
}

function dropDatabase() {
	return mongoose.connection.dropDatabase();
}

describe('Blog Posting API', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedData();
	});

	afterEach(function() {
		return dropDatabase();
	});

	after(function() {
		return stopServer();
	});

	it('should return all the existing posts on a GET request that does not take id as a req param', function() {
		return chai.request(app)
			.get('/posts')
			.then(function(res) {
				res.should.have.status(200);
				res.body.should.have.length.of.at.least(10);
				res.body.forEach(function(post) {
					post.should.include.keys('id','title', 'content', 'author');
				})
			});
	});

	it('should create a new post based on user request', function() {
		let newPost = generatePostInputForRequest();
		return chai.request(app)
			.post('/posts')
			.send(newPost)
			.then(function(res) {
				res.should.have.status(201);
				res.body.should.include.keys('id','title', 'content', 'author');
			});
	});

	it('should change a existing post', function() {
		let updatePost = {
			title: 'lololololooooo',
			content: 'the quiasd lkasdlknasckneoirnfoimscd',
			firstName: 'leonardo',
			lastName: 'steffen'
		};

		return Post.findOne()
			.then(function(post) {
				updatePost.id = post.id;
			})
			.then(function() {
				return chai.request(app)
					.put(`/posts/${updatePost.id}`)
					.send(updatePost)
					.then(function(res) {
						res.should.have.status(204);
					});
			})
			.then(function() {
				return Post.findById(updatePost.id)
			})
			.then(function(returnedPost) {
				returnedPost.apiRepr().content.should.equal(updatePost.content);
			})

	});

	it('should delete an existing post', function() {
		let postCount = '';
		return Post.find()
			.then(function(res) {
				postCount = res.length;
			});

		return Post.findOne()
			.then(function(postToDelete) {
				postId = postToDelete;
				return chai.request(app)
					.delete(`/posts/${postToDelete.id}`)
					.then(function(res) {
						res.should.have.status(204);
					})
			})
			.then(function() {
				return Post.find()
					.then(function(res) {
						res.length.should
					})
			})
	})

});