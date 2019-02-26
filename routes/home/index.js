const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');

router.all('/*', (req, res, next)=>
{
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res)=>
{   
    Post.find({}).then(posts=>
    {
        Category.find({}).then(categories=>
        {
            res.render('home/index', {posts:posts, categories: categories});
        }).catch(err=>
        {
            let msg = `Failed to load categories. Error: ${err}`;
            req.flash('errorMessage', msg);
            res.render('home/index', {posts: posts});
        })
        
    }).catch(err=>
    {
        let msg = `Failed to load posts. Error: ${err}`;
        req.flash('errorMessage', msg);
        res.render('home/index');
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
        Category.find({}).then(categories=>
        {
            res.render('home/posts/post', {post: post, categories: categories});
        }).catch(err=>
        {
            let msg = `Failed to load categories. Error: ${err}`;
            req.flash('errorMessage', msg);
            res.render('home/posts/post', {post: post});
        });
        
    }).catch(err=>
    {
        let msg = `Failed to load post: ${req.params.id}. Error: ${err}`;
        req.flash('errorMessage', msg);
        res.redirect('/');
    });
});

module.exports = router;