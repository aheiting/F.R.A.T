'use strict'

const net = require('net');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const Handlebars = require('handlebars');
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

const DBAbstraction = require('./DBAbstraction.js');
const Server = require('./server.js');

const db = new DBAbstraction('mongodb://localhost:27017');

const sv = new Server;

//sv.setShitUp();

//var info = sv.stop();

const app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

Handlebars.registerHelper('json', function(items) {
    return JSON.stringify(items);
});
sv.setShitUp();
app.get('/start', async(req, res) => {
    
    console.log("is it getting here?");
    res.json("success");
});

app.get('/stop', async(req, res) => {
    var info = sv.retrieve();
    console.log(info);
    res.json(info);
})

app.post('/classes', async(req, res) => {
    try {
        const ClassName = req.body.ClassName;
        const DateTime = req.body.DateTime;
        const Students = req.body.Students;

        await db.insertClass(ClassName, DateTime, Students);
        res.redirect('/home');
    } catch (err) {
        console.log(err);
    }
});

app.get('/allClasses', async(req, res) => {
    try {
        const AllClasses = await db.getAllClasses();
        res.json(AllClasses);
    } catch (err) {
        console.log(err);
    }
})

app.get('/home', async(req, res) => {
    const classes = await db.getAllClasses();
    res.render('home', { NewClass: classes });
});

app.get('/newClass', async(req, res) => {
    res.render('newClass');
});
app.get('/detailedClass/:myvar', async(req, res) => {
    const classID = req.params.myvar;
    const Class = await db.getClassByID(classID);
    //console.log(Class);
    res.render('detailedClass', { NewClass: Class });
});

app.get('/website', async(req, res) => {
    res.render('archive');
});

app.use((req, res) => {
    res.status(404).send(`<h2>Uh Oh!</h2><p>Sorry ${req.url} cannot be found here</p>`);
});

app.listen(53140, function() {
    console.log('The server is up and running on port 53140...');
});

// db.init()
//     .then(() => {
//         app.listen(53140, () => console.log('The server is up and running...'));
//     })
//     .catch(err => {
//         console.log('Problem setting up the database');
//         console.log(err);
//     });