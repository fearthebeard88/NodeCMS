const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const urlSlug = require('mongoose-url-slugs');

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    slug: {
        type: String
    }
});

CategorySchema.plugin(urlSlug('name', {field: 'slug'}));
module.exports = mongoose.model('categories', CategorySchema);