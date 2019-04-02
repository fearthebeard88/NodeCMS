const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const urlSlug = require('mongoose-url-slugs');

const CommentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    approveComment: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now()
    },
    slug: {
        type: String
    },
    title: {
        type: String,
        required: true
    }
});

CommentSchema.plugin(urlSlug('title', {field: 'slug'}));
module.exports = mongoose.model('comments', CommentSchema);