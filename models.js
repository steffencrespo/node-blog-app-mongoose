const mongoose = require('mongoose');

const blogPostsSchema = mongoose.Schema({
	title: {type: String, required: true},
	content: {type: String, required: true},
	author: {
		firstName: String,
		lastName: String,
	}
});

const Post = mongoose.model('Post', blogPostsSchema);
module.exports = {Post};