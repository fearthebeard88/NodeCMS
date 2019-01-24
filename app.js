const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');

// tells server to serve static content (css and js files) from public
// directory
app.use(express.static(path.join(__dirname, 'public')));

// telling server what the template engine and extension is, and
// setting default layout file
app.engine('handlebars', exphbs({defaultLayout: 'home'}));

// assigning a name to a value, kind of like a registry
// some names are reserved for the express app
app.set('view engine', 'handlebars');

// requiring router files for home and admin
const home = require('./routes/home/index.js');
const admin = require('./routes/admin/index.js');

// tells the server when the base of the request matches one of these
// patterns to use the correct router based off the base of the path
app.use('/', home);
app.use('/admin', admin);

app.listen(8000, ()=>
{
    console.log('Server running on port 8000');
});