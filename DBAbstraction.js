const MongoClient = require('mongodb').MongoClient;

class DBAbstraction {
    constructor(dbUrl) {
        this.dbUrl = dbUrl;
    }

    init() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.dbUrl, { useNewUrlParser: true }, (err, client) => {
                if (err) {
                    reject(err);
                } else {
                    client.close();
                    resolve();
                }
            });
        });
    }

    async getTeamName(searchValue) {
        console.log(searchValue);
        let teamName = [];
        let teamNameTwo = [];
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('GamesDB');

            teamName = await db.collection('Games').find({ "NameOne": searchValue }).toArray();
            teamNameTwo = await db.collection('Games').find({ "NameTwo": searchValue }).toArray();
            teamNameTwo.forEach(e => {
                teamName.push(e);
            })

            client.close();
        } catch (err) {
            console.log('There was a problem finding the games');
            throw err;
        }
        console.log(teamName);
        return teamName;

    }

    async getLocationName(searchValue) {

        let locationName = [];
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('GamesDB');

            locationName = await db.collection('Games').find({ "Locationn": searchValue }).toArray();
            client.close();
        } catch (err) {
            console.log('There was a problem finding the games');
            throw err;
        }
        //console.log(allGames);
        return locationName;

    }

    async getGameDate(searchValue) {

        let gameDate = [];
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('GamesDB');

            gameDate = await db.collection('Games').find({ "GameDate": searchValue }).toArray();
            client.close();
        } catch (err) {
            console.log('There was a problem finding the games');
            throw err;
        }
        //console.log(allGames);
        return gameDate;

    }

    async getAllGames() {

        let allGames = [];
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('GamesDB');

            allGames = await db.collection('Games').find().toArray();
            client.close();
        } catch (err) {
            console.log('There was a problem finding the games');
            throw err;
        }
        //console.log(allGames);
        return allGames;

    }

    async insertGame(NameOne, NameTwo, Score, Locationn, GameDate) {
        try {
            const newGame = {
                NameOne: NameOne,
                NameTwo: NameTwo,
                Score: Score,
                Locationn: Locationn,
                GameDate: GameDate
            };

            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('GamesDB');

            await db.collection('Games').insertOne(newGame);
            client.close();
        } catch (err) {
            console.log('There was a problem with the insert');
            throw err;
        }
    }

    async getGameByName(NameOne, NameTwo) {

        let legend = null;
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('GamesDB');

            legend = await db.collection('Games').findOne({ "NameOne": NameOne });
            if (legend === null) {
                legend = await db.collection('Games').findOne({ "NameTwo": NameTwo });
            }
            client.close();
        } catch (err) {
            console.log('There was a problem finding the legend');
            throw err;
        }
        return legend;
    }
}
module.exports = DBAbstraction;