const express = require('express');
const port = process.env.PORT || 8000;
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const parser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');

// tells server to serve static content (css and js files) from public
// directory
app.use(express.static(path.join(__dirname, 'public')));

// used for file uploads
app.use(upload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// useNewUrlParser tells mongoose to use the new url parser method 
// for their api. useFindAndModify is another bit of deprecated code
// and by setting that option to false it tells the mongoose api to 
// use the newer findOneAndModify methods instead
mongoose.connect('mongodb://localhost:27017/cms', {useNewUrlParser: true, useFindAndModify: false}).then((db)=>
{
    console.log('Database connected.');
}).catch(err=>
{
    console.log(err);
});

// registering helper methods to use in middleware
const {select, prettyPrintDate} = require('./helpers/handlebars-helper.js');

// telling server what the template engine and extension is, and
// setting default layout file
// helpers is telling handlebars about the helper methods that are
// exported in the helpers directory
app.engine('handlebars', exphbs({defaultLayout: 'home',
                                 helpers: {select: select, prettyPrintDate: prettyPrintDate}}));

// assigning a name to a value, kind of like a registry
// some names are reserved for the express app
app.set('view engine', 'handlebars');

app.use(parser.urlencoded({extended: true}));
app.use(parser.json());

// method override
app.use(methodOverride('_method'));

app.use(session({
    secret: 'IHaveNoIdeaWhatThisDoes',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

// setting local variable for handlebars using middleware and flash
app.use((req, res, next)=>
{
    res.locals.successMessage = req.flash('successMessage');
    next();
});

// requiring router files for home and admin
const home = require('./routes/home/index.js');
const admin = require('./routes/admin/index.js');
const posts = require('./routes/admin/posts.js');
const categories = require('./routes/admin/categories.js');

// tells the server when the base of the request matches one of these
// patterns to use the correct router based off the base of the path
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);

app.listen(port, ()=>
{
    console.log(`Listening on port ${port}`);
});