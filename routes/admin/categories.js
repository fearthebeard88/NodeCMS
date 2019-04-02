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

// TODO: switch from rendering errors to sending
// flash message errors, this is more consistent
// with the design pattern so far
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
        });
    }
});

// TODO: change search by id to search by slug
// TODO: change front facing error message to something
// more generic, log real message
router.get('/edit/:id', (req, res)=>
{
    Category.findById(req.params.id).then(category=>
    {
        res.render('admin/categories/edit', {category: category});
    }).catch(err=>
    {
        let msg = `Unable to get category with id: ${req.params.id}.
         Recieved the following error: ${err}`;
        req.flash('errorMessage', msg);
        res.redirect('/admin/categories');
    });
});

// TODO: change search by id to search by slug
// TODO: review catch statements
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
    else
    {
        Category.findOne({_id: req.params.id}).then(category=>
        {
            category.name = req.body.name;
            category.save().then(updatedCat=>
            {
                let msg = `${category.name} has been updated.`;
                req.flash('successMessage', msg);
                res.redirect('/admin/categories');
            });
        }).catch(err=>
        {
            let msg = `The following error occured when
             attempting to find ${req.body.name}. Error: ${err}`;
            req.flash('errorMessage', msg);
            res.redirect('/admin/categories');
        });
    }
});

// TODO: change search by id to search by slug
router.delete('/delete/:id', (req, res)=>
{
    Category.findOneAndDelete({_id: req.params.id}).then(id=>
    {
        let msg = `${id.id} has been removed.`;
        req.flash('successMessage', msg);
        res.redirect('/admin/categories');
    });
});

module.exports = router;