const express = require('express');
const router = express.Router();

// tells the server to apply logic to all requests that match
// the base of this route
router.all('/*', (req, res, next)=>
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
    res.render('admin/index');
});

router.get('/dashboard', (req, res)=>
{
    res.render('admin/dashboard');
})

module.exports = router;