const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const should = chai.should();

const {Post} = require('../models');
const {runServer, app, stopServer} = require('../server');

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
		return runServer();
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

});