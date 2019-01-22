const express = require('express');
const router = express.Router();

router.all('/*', (req, res, next)=>
{
    
})

// url actually looks like localhost.local/admin/
router.get('/', (req, res)=>
{
    res.render('admin/index');
});

module.exports = router;