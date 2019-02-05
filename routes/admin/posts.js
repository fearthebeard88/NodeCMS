const express = require('express');
const router = express.Router();
const parser = require('body-parser');

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
    res.render('admin/posts/index');
})

router.get('/create', (req, res)=>
{
    res.render('admin/posts/create');
});

module.exports = router;