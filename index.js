'use strict'

const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const Handlebars = require('handlebars');
const handlebars = require('express-handlebars').create({defaultLayout: 'main'}); 

const DBAbstraction = require('./DBAbstraction');

const db = new DBAbstraction('mongodb://localhost:27017');

const app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');   
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

Handlebars.registerHelper('json', function(items) {
    return JSON.stringify(items);
  });



app.get('/', async (req, res) => {
    //const musician = await db.getAll();
    
    //var str = JSON.stringify(musician);
    //console.log(str);
    res.render('home');
});

app.get('/class', async (req, res) => {
    res.render('class');
});

app.get('/website', async (req, res) => {
    res.render('archive');
});




app.use((req, res) => {
    res.status(404).send(`<h2>Uh Oh!</h2><p>Sorry ${req.url} cannot be found here</p>`);
});

db.init()
    .then(() => {
        app.listen(53140, () => console.log('The server is up and running...'));
    })
    .catch(err => {
        console.log('Problem setting up the database');
        console.log(err);
    });