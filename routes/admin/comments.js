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
                let msg = `Comment saved. The comment will show once the post
                author approves the comment.`;
                req.flash('successMessage', msg);
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
    });
});

router.post('/approve-comment', (req,res)=>
{
    Comment.findByIdAndUpdate(req.body.id,
        {$set: {approveComment: req.body.approveComment}}).then(comment=>
        {
            res.send(comment);
        }).catch(err=>
        {
            if (err) return err;
        })
});

module.exports = router;