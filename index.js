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
let myStudentArray = [];

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
    sv.retrieve();
    console.log("is it getting here?");
    res.json("success");
});
var info;
var studentNames = [];
//console.log(info);
app.get('/stop', async(req, res) => {
    info = sv.retrieve();
    console.log(info);
    var studentNameArray = []
        //parse
    var name = "";
    for (var j = 0; j < info.length; j++) {
        for (var i = 0; i < info[j].length; i++) {
            if (info[j][i] != ",") {
                console.log(name);
                name = name + info[j][i];
            } else {
                console.log(name);
                studentNameArray.push(name);
                name = '';
                i = info[j].length;
            }
        }
    }

    //make student object
    console.log("The server name array: " + studentNameArray);
    console.log("The client name array: " + myStudentArray);

    //compare

    let here=[];
    let not_here=[];
    for (var j = 0; j < studentNameArray.length; j++) {
        var is_here=false;
        for (var i = 0; i < myStudentArray.length; i++) {
            if(studentNameArray[j]==myStudentArray[i])
            {
                here+=studentNameArray[j];
                is_here=true;
            }
        }
        if(is_here==false)
        {
            not_here=studentNameArray[j];
        }
    }
    console.log(here);
    console.log(not_here);
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

app.get('/', async(req, res) => {
    const classes = await db.getAllClasses();
    res.render('home', { NewClass: classes });
});

app.get('/newClass', async(req, res) => {
    res.render('newClass');
});
app.get('/detailedClass/:myvar', async(req, res) => {
    const classID = req.params.myvar;
    var Class = await db.getClassByID(classID);
    myStudentArray = [];
    //myStudentArray = Class.student;
    for (var i = 0; i < Class[0].student[0].studentName.length; i++) {
        myStudentArray[i] = Class[0].student[0].studentName[i];
    }
    //myStudentArray[1];
    console.log(myStudentArray);
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