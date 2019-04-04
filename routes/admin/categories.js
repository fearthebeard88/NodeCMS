const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const {postValidator} = require('../../helpers/handlebars-helper');
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*', userAuthenticated, (req, res, next)=>
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
        for (let i = 0; i < errors.length; i++)
        {
            req.flash('errorMessage', errors[i].message);
        }

        res.redirect('/admin/categories');
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
        });
    }
});

router.get('/edit/:slug', (req, res)=>
{
    Category.findOne({slug: req.params.slug}).then(category=>
    {
        res.render('admin/categories/edit', {category: category});
    }).catch(err=>
    {
        let msg = `No category with slug: ${req.params.slug}.
         Recieved the following error: ${err}`;
        req.flash('errorMessage', msg);
        res.redirect('/admin/categories');
    });
});

// TODO: review catch statements
router.put('/edit/:slug', (req, res)=>
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

        res.redirect('/admin/categories/edit/' + req.params.slug);
    }
    else
    {
        Category.findOne({slug: req.params.slug}).then(category=>
        {
            category.name = req.body.name;
            category.save().then(updatedCat=>
            {
                let msg = `${category.name} has been updated.`;
                req.flash('successMessage', msg);
                res.redirect('/admin/categories');
            });
        });
    }
});

router.delete('/delete/:slug', (req, res)=>
{
    Category.findOneAndDelete({slug: req.params.slug}).then(id=>
    {
        let msg = `${id.id} has been removed.`;
        req.flash('successMessage', msg);
        res.redirect('/admin/categories');
    });
});

module.exports = router;