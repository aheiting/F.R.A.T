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

    async insert(name, saxType, saxMan, saxModel, mouthMan, mouthModel, lig, reed ) {
        var info = [saxMan, saxModel, mouthMan, mouthModel, lig, reed]

        try {
            const Musician = {
                name: name,
                sax: [{type: saxType, des: info}],
            };

            //db.sax.insert({"Musician":"Alex", "Alto" : ["Jupiter", "Arisian", "JodyJazz", "Classical", "Rico H", "Vandoren V16 2 1/2"]})
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('SaxDB');

            await db.collection('Sax').insertOne(Musician); //can also insertMany
            client.close();

        } catch(err) {
            console.log('There was a problem with the insert');
            throw err;
        }
    }

    async insertSax(name, saxType, saxMan, saxModel, mouthMan, mouthModel, lig, reed ) {
        var info = [saxMan, saxModel, mouthMan, mouthModel, lig, reed]

        try {
            //db.sax.insert({"Musician":"Alex", "Alto" : ["Jupiter", "Arisian", "JodyJazz", "Classical", "Rico H", "Vandoren V16 2 1/2"]})
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('SaxDB');

            await db.collection('Sax').updateOne({name: name}, {$push:({sax: {type: saxType, des: info}})});
            client.close();

        } catch(err) {
            console.log('There was a problem with the insert');
            throw err;
        }
    }    

    // async insert(name, saxType, saxMan, saxModel, mouthMan, mouthModel, lig, reed ) {
    //     var info = [saxMan, saxModel, mouthMan, mouthModel, lig, reed]

    //     try {
    //         const Musician = {
    //             musician: name,
    //             sax: saxType,
    //             info: info,
    //         };

    //         //db.sax.insert({"Musician":"Alex", "Alto" : ["Jupiter", "Arisian", "JodyJazz", "Classical", "Rico H", "Vandoren V16 2 1/2"]})
    //         const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
    //         const db = client.db('SaxDB');

    //         await db.collection('Sax').insertOne(Musician); //can also insertMany
    //         client.close();

    //     } catch(err) {
    //         console.log('There was a problem with the insert');
    //         throw err;
    //     }
    // }

    async getAll() {
        
        let all = [];
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('SaxDB');

            all = await db.collection('Sax').find().toArray();
            client.close();
        } catch (err) {
            console.log('There was a problem finding the games');
            throw err;
        }
        return all;
    }

    async getByName(userName) {
        let all = [];
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('SaxDB');

            all = await db.collection('Sax').mapReduce({"musician": userName}).toArray();
            client.close();
        } catch (err) {
            console.log('There was a problem finding the games');
            throw err;
        }
        return all;
    }

}
module.exports = DBAbstraction;