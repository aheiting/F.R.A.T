'use strict'

const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");

const DBAbstraction = require('./DBAbstraction');

const db = new DBAbstraction('mongodb://localhost:27017');

const app = express();

const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', async(req, res) => {

    const allGames = await db.getAllGames();
    res.render('allGames', { games: allGames });
});

app.get('/teamName/:searchValue', async(req, res) => {

    try {
        const searchValue = req.params.searchValue;
        //console.log(searchValue);
        const searchTeam = await db.getTeamName(searchValue);
        res.json(searchTeam);

    } catch (err) {
        console.log(err);
    }
});

app.get('/location/:searchValue', async(req, res) => {

    try {
        const searchValue = req.params.searchValue;
        //console.log(searchValue);
        const searchLocation = await db.getLocationName(searchValue);
        res.json(searchLocation);
    } catch (err) {
        console.log(err);
    }
});

app.get('/gameDate/:searchValue', async(req, res) => {

    try {
        const searchValue = req.params.searchValue;
        //console.log(searchValue);
        const searchGameDate = await db.getGameDate(searchValue);
        res.json(searchGameDate);
    } catch (err) {
        console.log(err);
    }
});

app.get('/allGames', async(req, res) => {

    try {
        const searchAllGames = await db.getAllGames();
        res.json(searchAllGames);
    } catch (err) {
        console.log(err);
    }
});

app.post('/games', async(req, res) => {
    try {
        const NameOne = req.body.NameOne;
        const NameTwo = req.body.NameTwo;
        const Score = req.body.Score;
        const Locationn = req.body.Locationn;
        const GameDate = req.body.GameDate;

        await db.insertGame(NameOne, NameTwo, Score, Locationn, GameDate);

        const allGames = await db.getAllGames();
        res.json(allGames);

    } catch (err) {
        console.log(err);
    }
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