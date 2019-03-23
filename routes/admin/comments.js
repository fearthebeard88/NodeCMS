const express = require('express');
const router = express.Router();
const Comment = require('../../models/Comment');
const Post = require('../../models/Post');

router.all('/*', (req, res, next)=>
{
    req.app.locals.layout = 'admin';
    next();
});

router.post('/', (req, res)=>
{
    Post.findById(req.body.id).then(post=>
    {
        comment = new Comment({
            body: req.body.body,
            user: req.user.id
        });

        post.comments.push(comment);

        post.save().then(savedPost=>
        {
            comment.save().then(savedComment=>
            {
                res.redirect(`/post/${savedPost.id}`);
            });
        });   
    });
});

router.get('/', (req, res)=>
{
    Comment.find({user: req.user.id}).populate('user').then(comments=>
    {
        res.render('admin/comments', {comments: comments});
    });
});

router.delete('/delete/:id', (req, res)=>
{
    Comment.findOneAndDelete({_id: req.params.id}).then(deletedComment=>
    {
        Post.findOneAndUpdate({comments: req.params.id}, {
            $pull: {comments: req.params.id}
        }).then(data=>
        {
            req.flash('successMessage', `Deleted comment with id: ${deletedComment.id}`);
            res.redirect('/admin/comments');
        }).catch(err=>
        {
            console.log(err);
            req.flash('errorMessage', `Recieved error: ${err}`);
            res.redirect('/admin.comments');
        });
    })
})

module.exports = router;