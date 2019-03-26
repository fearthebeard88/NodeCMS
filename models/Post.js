const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const urlSlug = require('mongoose-url-slugs');

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        required: true
    },
    allowComments: {
        type: Boolean,
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    file: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    
    // referencing another schema
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    slug: {
        type: String
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]
});

PostSchema.plugin(urlSlug('title', {field: 'slug'}));
module.exports = mongoose.model('Post', PostSchema);