const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const User = require('../../models/User');
const faker = require('faker');
const {userAuthenticated} = require('../../helpers/authentication');

// tells the server to apply logic to all requests that match
// the base of this route
router.all('/*',userAuthenticated, (req, res, next)=>
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
    Post.countDocuments({}).then(postCount=>
    {
        Comment.countDocuments({}).then(commentCount=>
        {
            User.countDocuments({}).then(userCount=>
            {
                Category.countDocuments({}).then(categoryCount=>
                {
                    res.render('admin/index', {postCount: postCount,
                        commentCount: commentCount,
                        userCount: userCount,
                        categoryCount: categoryCount});
                })
            })
        })
    })
    
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
        post.slug = faker.name.title();

        post.save().then(newPost=>
        {
            console.log(`${post.id} has been created.`);
        }).catch(err=>
        {
            let msg = `Error occured during dummy post
            creation. Error: ${err}`;
            console.log(msg);
        });
    }

    res.redirect('/admin/posts');
})

module.exports = router;