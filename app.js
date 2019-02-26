// requiring express module to run server
const express = require('express');

// setting port for server to listen on. will look for environment
// variable PORT or fallback on port 8000
const port = process.env.PORT || 8000;

// instantiating an instance of express
const app = express();

// requiring/including nodes built in path module for working
// with file paths
const path = require('path');

// requiring a template engine (express handlebars)
const exphbs = require('express-handlebars');

// requiring mongoose for setting up schemas for database
const mongoose = require('mongoose');

// requiring body parser middleware to let node read url encrypted
// and json data
const parser = require('body-parser');

// requring a module to allow forms to use different http methods
// other than GET and POST
const methodOverride = require('method-override');

// requring a module to handle file uploads
const upload = require('express-fileupload');

// requiring a module to hold session data
const session = require('express-session');

// requiring a module to pass strings by session data between pages
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

// require/include these methods defined in helper directory
// registering helper methods to use in middleware
const {select, prettyPrintDate} = require('./helpers/handlebars-helper.js');

// telling server what the template engine and extension is, and
// setting default layout file
// helpers is telling handlebars about the helper methods that are
// exported in the helpers directory
app.engine('handlebars', exphbs({defaultLayout: 'home',
                                 helpers: {select: select, prettyPrintDate: prettyPrintDate}}));

// setting a key : value pair, similar to Magento's registry
// for global variables available anywhere on the app
// Note: some key's are reserved for express
app.set('view engine', 'handlebars');

// using body parser module to decode url encoded and json encoded
// values
app.use(parser.urlencoded({extended: true}));
app.use(parser.json());

// using method override module to parse form data request urls 
// to change HTTP method used to actually make the request. 
app.use(methodOverride('_method'));

// secret: used to sign session cookies
// resave: forces session to be saved to session store even
// if session has not been modified during a request
// saveUnitialized: saves new/unmodified sessions to session store
app.use(session({
    secret: 'Ionlyhaveavagueideaofwhatthisdoes',
    resave: true,
    saveUninitialized: true
}));

// setting flash middleware for passing strings in session data
app.use(flash());

// setting local variable for handlebars using middleware and flash
app.use((req, res, next)=>
{
    // I think this intercepts requests with flash object
    // that has properties of string included as argument
    // and sets them as local variables to the app
    res.locals.successMessage = req.flash('successMessage');
    res.locals.errorMessage = req.flash('errorMessage');
    next();
});

// including different routers used for dealing with requests
const home = require('./routes/home/index.js');
const admin = require('./routes/admin/index.js');
const posts = require('./routes/admin/posts.js');
const categories = require('./routes/admin/categories.js');

// matches requests or part of a request to a router
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);

app.listen(port, ()=>
{
    console.log(`Listening on port ${port}`);
});