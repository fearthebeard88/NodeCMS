const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', handlebars({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');

app.get('/', (req, res)=>
{
    res.render('home/index');
})

app.listen(8000, ()=>
{
    console.log('Server running on port 8000');
})