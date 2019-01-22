const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');

const home = require('./routes/home/index.js');
const admin = require('./routes/admin/index.js');
app.use('/', home);
app.use('/admin', admin);

app.listen(8000, ()=>
{
    console.log('Server running on port 8000');
});