const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');
const Category = require('../../models/Category');
const {postValidator} = require('../../helpers/handlebars-helper');
const bcrypt = require('bcryptjs');

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

router.post('/register', (req, res)=>
{
    let requiredFields = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        password: 'Password',
        passwordConfirm: 'Password Confirmation'
    };

    let errors = postValidator(req.body, requiredFields);
    if (errors == null)
    {
        errors = [{message: 'Validation failed.'}];
    }

    if (req.body.password !== req.body.passwordConfirm)
    {
        errors.push({message: 'Passwords do not match.'});
    }

    // User.findOne({email: req.body.email}).then(user=>
    // {
        
    // })

    if (errors.length > 0)
    {
        for (let i = 0; i < errors.length; i++)
        {
            req.flash('errorMessage', errors[i].message);
        }

        var badUser = {
            firstName: null,
            lastName: null,
            email: null,
            password: null
        };

        for (let prop in badUser)
        {
            if (badUser.hasOwnProperty(prop) && req.body.hasOwnProperty(prop))
            {
                badUser[prop] = req.body[prop];
            }
        }
        
        console.log(errors);
        res.render('home/register', {badUser: badUser, errorMessage: req.flash(errors)});
    }
    else
    {
        bcrypt.genSalt(10, (err, salt)=>
        {
            if (err)
            {
                throw err;
            }

            bcrypt.hash(req.body.password, salt, (err, hash)=>
            {
                if (err)
                {
                    throw err;
                }

                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hash
                });
    
                newUser.save().then(user=>
                {
                    let msg = `Welcome ${user.firstName}! You have registered successfully. Please login.`;
                    req.flash('successMessage', msg);
                    res.redirect('/login');
                }).catch(err=>
                {
                    let msg = `Failed to register user ${req.body.firstName}. 
                    Error: ${err}`;
                    req.flash('errorMessage', msg);
                    res.redirect('/login');
                });
            });
        });
    }
})

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