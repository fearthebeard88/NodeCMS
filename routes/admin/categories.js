const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const {postValidator} = require('../../helpers/handlebars-helper');

router.all('/*', (req, res, next)=>
{
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res)=>
{
    Category.find({}).then(categories=>
    {
        res.render('admin/categories/index', {categories: categories});
    }).catch(err=>
    {
        res.render(err);
    });
});

router.post('/create', (req, res)=>
{
    let requiredProperties = {name: 'Name'};
    let errors = postValidator(req.body, requiredProperties);
    if (errors == null)
    {
        errors = [{message: 'Validation failed.'}];
    }

    if (errors.length > 0)
    {
        res.render('admin/categories/index', {
            errors: errors
        });
    }
    else
    {
        let category = new Category({
            name: req.body.name
        });

        category.save().then(newCategory=>
        {
            let msg = `Saved new category ${newCategory.name}`;
            req.flash('successMessage', msg);
            res.redirect('/admin/categories');
        }).catch(err=>
        {
            let msg = `Error saving new category ${req.body.name}`;
            req.flash('errorMessage', msg);
            res.redirect('/admin/categories');
        });
    }
});

router.get('/edit/:id', (req, res)=>
{
    Category.findById(req.params.id).then(category=>
    {
        res.render('admin/categories/edit', {category: category});
    }).catch(err=>
    {
        res.sendStatus(404).send(`Category with id ${req.params.id} not found.`);
        res.end();
    });
});

router.put('/edit/:id', (req, res)=>
{
    let requiredProperties = {name: 'Name'};
    let errors = postValidator(req.body, requiredProperties);
    if (errors == null)
    {
        errors = [{message: 'Validation failed.'}];
    }

    if (errors.length > 0)
    {
        for (let i = 0; i < errors.length; i++)
        {
            req.flash('errorMessage', errors[i].message);
        }

        res.redirect('/admin/categories/edit/' + req.params.id);
    }
})

module.exports = router;