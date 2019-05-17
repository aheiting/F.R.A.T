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

    async insert(className, saxType, saxMan, saxModel, mouthMan, mouthModel, lig, reed ) {

        try {
            const Class = {
                className: name,
                students: [{type: saxType, des: info}],
            };

            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('AttendanceDB');

            await db.collection('classes').insertOne(Class); //can also insertMany
            client.close();

        } catch(err) {
            console.log('There was a problem with the insert');
            throw err;
        }
    }

    async insertSax(name, saxType, saxMan, saxModel, mouthMan, mouthModel, lig, reed ) {

        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('AttendanceDB');

            await db.collection('classes').updateOne({className: name}, {$push:()});
            client.close();

        } catch(err) {
            console.log('There was a problem with the insert');
            throw err;
        }
    }    

    async getAll() {
        
        let all = [];
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('AttendanceDB');

            all = await db.collection('classes').find().toArray();
            client.close();
        } catch (err) {
            console.log('There was a problem finding the games');
            throw err;
        }
        return all;
    }

    // async getByName(userName) {
    //     let all = [];
    //     try {
    //         const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
    //         const db = client.db('AttendanceDB');

    //         all = await db.collection('Sax').mapReduce({"musician": userName}).toArray();
    //         client.close();
    //     } catch (err) {
    //         console.log('There was a problem finding the games');
    //         throw err;
    //     }
    //     return all;
    // }

}
module.exports = DBAbstraction;