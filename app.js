const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const parser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/cms', {useNewUrlParser: true}).then((db)=>
{
    console.log('Database connected.');
}).catch(err=>
    {
        console.log(err);
    });

// tells server to serve static content (css and js files) from public
// directory
app.use(express.static(path.join(__dirname, 'public')));

// telling server what the template engine and extension is, and
// setting default layout file
app.engine('handlebars', exphbs({defaultLayout: 'home'}));

// assigning a name to a value, kind of like a registry
// some names are reserved for the express app
app.set('view engine', 'handlebars');

app.use(parser.urlencoded({extended: true}));
app.use(parser.json());

// requiring router files for home and admin
const home = require('./routes/home/index.js');
const admin = require('./routes/admin/index.js');
const posts = require('./routes/admin/posts.js');

// tells the server when the base of the request matches one of these
// patterns to use the correct router based off the base of the path
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);

app.listen(8000, ()=>
{
    console.log('Server running on port 8000');
});