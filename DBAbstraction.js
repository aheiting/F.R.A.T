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

    async insertClass(className, dateTime, students) {
        console.log('Is it ever getting here?')
        try {
            const NewClass = {
                name: className,
                date: dateTime,
                student: students,
            };
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('AttendanceDB');
            await db.collection('Classes').insertOne(NewClass);
            client.close();
        } catch (err) {
            console.log('There was a problem with inserting a class');
            throw err;
        }
        console.log("is it getting here?")
    }

    async insertStudent(firstName, lastName, image) {
        try {
            const newStudent = {
                fName: firstName,
                lName: lastName,
                img: image
            };
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('AttendanceDB');
            await db.collection('Students').insertOne(newStudent);
            client.close();
        } catch (err) {
            console.log('There was a problem with inserting a student');
            throw err;
        }
    }

    async getClassByID(classID) {
        let Class = [];
        console.log(classID);
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('AttendanceDB');

            Class = await db.collection('Classes').find({ "_id": classID }).toArray();
            console.log(Class[0]);
        } catch (err) {
            console.log('There was a problem finding the specific class');
            throw err;
        }
        return Class;
    }

    async getAllClasses() {
        let Classes = [];
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('AttendanceDB');

            Classes = await db.collection('Classes').find().toArray();
            client.close();
        } catch (err) {
            console.log('There was a problem finding all of the classes');
            throw err;
        }
        return Classes;
    }

    async getAllStudents() {
            let Students = [];
            try {
                const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
                const db = client.db('AttendanceDB');

                Students = await db.collection('students').find().toArray();
                client.close();
            } catch (err) {
                console.log('There was a problem finding all of the students');
                throw err;
            }
            return Students;
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