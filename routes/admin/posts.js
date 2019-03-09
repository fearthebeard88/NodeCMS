const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const {isEmpty, uploadDir} = require('../../helpers/upload-helper');
const fs = require('fs');
const {postValidator} = require('../../helpers/handlebars-helper');
const {userAuthenticated} = require('../../helpers/authentication');

// tells the server to apply logic to all requests that match
// the base of this route
router.all('/*', userAuthenticated, (req, res, next)=>
{
    // req.app holds reference to instance of server that is using 
    // middleware
    req.app.locals.layout = 'admin';
    next();
});

// View all posts
router.get('/', (req, res)=>
{
    // populate method takes a path (from the originating model)
    // and grabs the associated object
    Post.find({}).populate('category').then(posts=>
    {
        res.render('admin/posts/index', {posts: posts});
    });
});

// Create a post
router.get('/create', (req, res)=>
{
    Category.find({}).then(categories=>
    {
        res.render('admin/posts/create', {categories: categories});
    });
});

router.post('/create', (req, res)=>
{
    let requiredProperties = {title: 'Title', body: 'Description'};
    // let errors = [];

    // for (let property in req.body)
    // {
    //     if (req.body.hasOwnProperty(property) && requiredProperties.hasOwnProperty(property))
    //     {
    //         if (!req.body.property)
    //         {
    //             errors.push({
    //                 message: `${requiredProperties[property]} cannot be empty.`
    //             });
    //         }
    //     }
    // }

    let errors = postValidator(req.body, requiredProperties);
    if (errors == null)
    {
        errors = [{message: 'Validation failed.'}];
    }

    if (errors.length > 0)
    {
        res.render('admin/posts/create', {
            errors: errors
        });
    }
    else
    {
        // placeholder image will go here
        let fileName = ''; 

        if (!isEmpty(req.files))
        {
            let file = req.files.file;
            fileName = Date.now() + '-' + file.name;

            file.mv('./public/uploads/' + fileName, (err)=>
            {
                if (err)
                {
                    throw err;
                }
            });

            // file.mv('./public/uploads/' + fileName, (err)=>
            // {
            //     if (err)
            //     {
            //         throw err;
            //     }
            // });
        }

        var newPost = new Post({
            title: req.body.title,
            status: req.body.status,
            allowComments: !(req.body.hasOwnProperty('allowComments')) ? false : true,
            body: req.body.body,
            file: fileName,
            category: req.body.category
        });

        newPost.save().then(savedPost=>
        {
            let msg = `Saved new post ${savedPost.title}`;
            console.log(msg);
            req.flash('successMessage', msg);
            res.redirect('/admin/posts');
        });
    }
});

// View a post to edit

// to send a parameter in the url you need to use a placeholder
// in the route, so to get an id as a url parameter, 
// you use :id as a placeholder for the route
router.get('/edit/:id', (req, res)=>
{
    Post.findById(req.params.id).then(post=>
    {
        Category.find({}).then(categories=>
        {
            res.render('admin/posts/edit', {post: post, categories: categories});
        });
    }).catch(err=>
    {
        let msg = `Failed to load post with id: ${req.params.id}. Error: ${err}`;
        req.flash('errorMessage', msg);
        res.redirect('/admin/posts');
    });
});

// This is the actual edit request sent by the form
router.put('/edit/:id', (req, res)=>
{
    let requiredFields = {title: 'Title', body: 'Description'};
    let errors = postValidator(req.body, requiredFields);

    if (errors == null)
    {
        let msg = `Validation failed.`;
        req.flash('errorMessage', msg);
        res.redirect('/admin/posts/edit/' + req.params.id);
    }

    if (errors.length > 0)
    {
        for (let i = 0; i < errors.length; i++)
        {
            req.flash('errorMessage', errors[i].message);
        }

        res.redirect('/admin/posts/edit' + req.params.id);
    }

    let fileName = null;

    if (req.files.file.name.trim().length > 0)
    {
        console.log(req.files);
        let file = req.files.file;
        fileName = Date.now() + '-' + file.name;

        
        file.mv('./public/uploads/' + fileName, (err)=>
        {
            if (err)
            {
                throw err;
            }
        });
    }

    Post.findOne({_id: req.params.id}).then(post=>
    {
        post.status = req.body.status;
        post.title = req.body.title;
        post.allowComments = !(req.body.hasOwnProperty('allowComments')) ? false : true;
        post.body = req.body.body;
        post.category = req.body.category;
        if (fileName != null)
        {
            // if the user updated their image then we want to get 
            // rid of the old image so it does not clutter the 
            // upload directory
            let oldFile = post.file;
            console.log(post.file);
            fs.exists(uploadDir + oldFile, (exists)=>
            {
                if (!exists)
                {
                    console.log(`${oldFile} does not exist to delete.`);
                }
                else
                {
                    fs.unlink(uploadDir + oldFile, (err)=>
                    {
                        if (err)
                        {
                            console.log(`${oldFile} could not be deleted. Error: ${err}`);
                        }
                        else
                        {
                            console.log(`${oldFile} was deleted.`);
                        }
                    });
                }
            });

            post.file = fileName;
        }

        post.save().then(updated=>
        {
            let msg = `${updated.id} has been updated.`;
            req.flash('successMessage', msg);
            console.log(msg);
            res.redirect('/admin/posts');
        });
    });
});

// Delete a post
router.delete('/:id', (req, res)=>
{
    Post.findOneAndDelete({_id: req.params.id}).then(id=>
    {
        console.log(`${id.id} has been deleted.`);
        let file = id.file;
        fs.exists(uploadDir + file, (exists)=>
        {
            if (!exists)
            {
                console.log(`${file} does not exist to delete.`);
            }
            else
            {
                fs.unlink(uploadDir + file, (err)=>
                {
                    if (err)
                    {
                        console.log(`${file} could not be deleted. Error: ${err}`);
                    }
                    else
                    {
                        console.log(`${file} was deleted.`);
                    }
                });
            }
        });
        
        req.flash('successMessage', `${id.title} was deleted.`);
        res.redirect('/admin/posts');
    });
});

module.exports = router;