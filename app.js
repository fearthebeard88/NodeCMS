const express = require('express');
const port = process.env.PORT || 8000;
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const parser = require('body-parser');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/cms', {useNewUrlParser: true, useFindAndModify: false}).then((db)=>
{
    console.log('Database connected.');
}).catch(err=>
    {
        console.log(err);
    });

// tells server to serve static content (css and js files) from public
// directory
app.use(express.static(path.join(__dirname, 'public')));

const {select} = require('./helpers/handlebars-helper.js');
// telling server what the template engine and extension is, and
// setting default layout file
// helpers is telling handlebars about the helper methods that are
// exported in the helpers directory
app.engine('handlebars', exphbs({defaultLayout: 'home',
                                 helpers: {select: select}}));

// assigning a name to a value, kind of like a registry
// some names are reserved for the express app
app.set('view engine', 'handlebars');

app.use(parser.urlencoded({extended: true}));
app.use(parser.json());

// method override
app.use(methodOverride('_method'));

// requiring router files for home and admin
const home = require('./routes/home/index.js');
const admin = require('./routes/admin/index.js');
const posts = require('./routes/admin/posts.js');

// tells the server when the base of the request matches one of these
// patterns to use the correct router based off the base of the path
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);

app.listen(port, ()=>
{
    console.log(`Listening on port ${port}`);
});