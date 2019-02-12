const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const {isEmpty, uploadDir} = require('../../helpers/upload-helper');
const fs = require('fs');

// tells the server to apply logic to all requests that match
// the base of this route
router.all('/*', (req, res, next)=>
{
    // req.app holds reference to instance of server that is using 
    // middleware
    req.app.locals.layout = 'admin';
    next();
});

// View all posts
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

// Create a post
router.get('/create', (req, res)=>
{
    res.render('admin/posts/create');
});

router.post('/create', (req, res)=>
{
    // placeholder image will go here
    let fileName = ''; 

    if (!isEmpty(req.files))
    {
        let file = req.files.file;
        fileName = Date.now() + '-' + file.name;

        file.mv('./public/uploads/' + fileName);

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
        file: fileName
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

// View a post to edit

// to send a parameter in the url you need to use a placeholder
// in the route, so to get an id as a url parameter, 
// you use :id as a placeholder for the route
router.get('/edit/:id', (req, res)=>
{
    Post.findById(req.params.id).then(post=>
        {
            res.render('admin/posts/edit', {post: post});
        }).catch(err=>
            {
                res.sendStatus(404).send('Post not found.');
            });
});

// This is the actual edit request sent by the form
router.put('/edit/:id', (req, res)=>
{
    Post.findOneAndUpdate({_id: req.params.id}, {
        status: req.body.status,
        title: req.body.title,
        allowComments: !(req.body.hasOwnProperty('allowComments')) ? false : true,
        body: req.body.body
    }, {runValidators: true}).then(newPost=>
        {
            newPost.save().then(updated=>
            {
                console.log(`${updated.id} has been updated.`);
                res.redirect('/admin/posts');
            }).catch(err=>
                {
                    console.log(`${err.id} failed to update.`);
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
            if (fs.existsSync('./public/uploads/' + file))
            {
                fs.unlinkSync(uploadDir + file);
                console.log(`${file} has been deleted.`);
            }
            else{
                console.log(`${file} does not exist to delete.`);
            }
            
            res.redirect('/admin/posts');
        }).catch(err=>
            {
                console.log(err);
                res.redirect('/admin/posts');
            });

});

module.exports = router;