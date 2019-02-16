const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

router.all('/*', (req, res, next)=>
{
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res)=>
{   
    Post.find({}).then(posts=>
    {
        res.render('home/index', {posts:posts});
    }).catch(err=>
    {
        res.status(500).send('<h1>Error loading page</h1><br/><p>' + err + '</p>');
    });
});

router.get('/about', (req, res)=>
{
    res.render('home/about');
});

router.get('/login', (req, res)=>
{
    res.render('home/login');
});

router.get('/register', (req, res)=>
{
    res.render('home/register');
});

router.get('/post/:id', (req, res)=>
{
    Post.findById(req.params.id).then(post=>
    {
        res.render('home/posts/post', {post: post});
    }).catch(err=>
    {
        console.log(`Unable to locate post with id ${req.params.id}`);
        res.redirect('/');
    });
});

module.exports = router;