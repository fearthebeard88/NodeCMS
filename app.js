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
const {mongoUrl} = require('./config/database');
const passport = require('passport');
const User = require('./models/User');

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
// new way of connecting to mongo using callback instead of promise and catch. this method will
// exit the application if the database fails to connect.
mongoose.connect(mongoUrl, {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true}, (err)=>
{
    if (err)
    {
        // TODO: write to log file instead of console.log
        // TODO: implement email when a failure like this occurs
        console.log(`Failed to connect to database. \nError: ${err}`);
        console.log(process.pid);
        process.kill(process.pid);
    }

    console.log('Database is running on port 27017');
    app.emit('database', null);
})

// require/include these methods defined in helper directory
// registering helper methods to use in middleware
const {select, prettyPrintDate, paginate} = require('./helpers/handlebars-helper.js');

// telling server what the template engine and extension is, and
// setting default layout file
// helpers is telling handlebars about the helper methods that are
// exported in the helpers directory
app.engine('handlebars',
    exphbs({defaultLayout: 'home',
                helpers: {
                    select: select,
                    prettyPrintDate: prettyPrintDate,
                    paginate: paginate
                }}));

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

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done)=>
{
    return done(null, user.id);
})

passport.deserializeUser((id, done)=>
{
    User.findById(id, (err, user)=>
    {
        return done(err, user);
    })
})

// setting flash middleware for passing strings in session data
app.use(flash());

// setting local variable for handlebars using middleware and flash
app.use((req, res, next)=>
{
    // I think this intercepts requests with flash object
    // that has properties of string included as argument
    // and sets them as local variables to the app,
    // think of magento registry
    res.locals.user = req.user || null;
    res.locals.successMessage = req.flash('successMessage');
    res.locals.errorMessage = req.flash('errorMessage');

    // local variables for passport flash messages
    // res.locals.<object key to be retrieved> = 
    // req.flash(<object key that holds flash message value>)
    res.locals.failureFlash = req.flash('error');
    res.locals.successFlash = req.flash('success');
    next();
});

// including different routers used for dealing with requests
const home = require('./routes/home/index.js');
const admin = require('./routes/admin/index.js');
const posts = require('./routes/admin/posts.js');
const categories = require('./routes/admin/categories.js');
const comments = require('./routes/admin/comments.js');


// matches requests or part of a request to a router
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);

// app.listen(port, ()=>
// {
//     console.log(`Listening on port ${port}`);
//     app.on('database', ()=>
//     {
//         console.log('Application is running.');
//     });
    
// });

app.on('database', ()=>
{
    app.listen(port, ()=>
    {
        console.log(`Application is running on port: ${port}.`);
    });
});