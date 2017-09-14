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
				// res.body.post[0].should.have.length.of(10);
			});
	});

	it('should return specific post when the GET request has the ID parameter', function() {
		const post = [];
		let idForGetRequest;
		Post.findOne().then(function(res) {
			post.push(res);
		})
		.then(function() {
			idForGetRequest = post[0]._id;
			console.log(idForGetRequest)
		})
	});

});