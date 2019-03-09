const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const faker = require('faker');

// tells the server to apply logic to all requests that match
// the base of this route
router.all('/*', (req, res, next)=>
{
    // req.app holds reference to instance of server that is using 
    // middleware
    req.app.locals.layout = 'admin';
    next();
});

// url actually looks like localhost.local/admin/
// using middleware to tell express when /admin is requested to use this
// router instead of the home router
router.get('/', (req, res)=>
{
    res.render('admin/index');
});

router.post('/generate-fake-posts', (req, res)=>
{
    for (let i = 0; i < req.body.amount; i++)
    {
        let post = new Post();
        post.title = faker.name.title();
        post.allowComments = false;
        post.status = "draft";
        post.body = faker.lorem.paragraph(5);

        post.save().then(newPost=>
        {
            console.log(`${post.id} has been created.`);
        });
    }

    res.redirect('/admin/posts');
})

module.exports = router;