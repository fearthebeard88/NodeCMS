const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

// tells the server to apply logic to all requests that match
// the base of this route
router.all('/*', (req, res, next)=>
{
    // req.app holds reference to instance of server that is using 
    // middleware
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res)=>
{
    Post.find({}).then(posts=>
        {
            res.render('admin/posts/index', {posts: posts});
        }).catch(err=>
            {
                res.render(err);
            });
});

router.get('/create', (req, res)=>
{
    res.render('admin/posts/create');
});

router.post('/create', (req, res)=>
{
    var newPost = new Post({
        title: req.body.title,
        status: req.body.status,
        allowComments: !(req.body.hasOwnProperty('allowComments')) ? false : true,
        body: req.body.body
    });

    newPost.save().then(savedPost=>
        {
            console.log(`Saved new post ${newPost.title}`);
            res.redirect('/admin/posts');
        }).catch(err=>
            {
                console.log(`Error saving post. Error: ${err}`);
                res.redirect('/admin/posts');
            });
});

router.get('/edit', (req, res)=>
{
    res.render('admin/posts/edit');
})

module.exports = router;