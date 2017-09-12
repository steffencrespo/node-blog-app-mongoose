const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
	title: {type: String, required: true},
	content: {type: String, required: true},
	author: {
		firstName: String,
		lastName: String,
	}
});

blogPostSchema.virtual('authorString').get(function() {
	return `${this.firstName} ${this.lastName}`.trim();
});

blogPostSchema.methods.apiRepr = function() {
	return {
		title: this.title,
		content: this.content,
		author: this.authorString
	};
}

const Post = mongoose.model('Post', blogPostSchema);
module.exports = {Post};