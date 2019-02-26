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
        let msg = `Unable to get category with id: ${req.params.id}.
         Recieved the following error: ${err}`;
        req.flash('errorMessage', msg);
        res.redirect('/admin/categories');
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
            }).catch(err=>
            {
                let msg = `${category.name} was not updated.`;
                req.flash('errorMessage', msg);
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

router.delete('/delete/:id', (req, res)=>
{
    Category.findOneAndDelete({_id: req.params.id}).then(id=>
    {
        let msg = `${id.id} has been removed.`;
        req.flash('successMessage', msg);
        res.redirect('/admin/categories');
    }).catch(err=>
    {
        let msg = `Unable to delete category with id: ${req.params.id}.
         Error: ${err}`;
        req.flash('errorMessage', msg);
        res.redirect('/admin/categories');
    });
});

module.exports = router;