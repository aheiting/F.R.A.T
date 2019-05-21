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
        let studentArray = [];
        var wordSeparator = '';
        for (var i = 0; i < students.length; i++) {
            if (students[i] == ',') {
                studentArray.push(wordSeparator);
                wordSeparator = '';
                if (students[i] == ' ') {
                    continue;
                }
                continue;
            } else if (i == students.length - 1) {
                wordSeparator = wordSeparator + students[i];
                studentArray.push(wordSeparator);
                continue;
            }
            wordSeparator = wordSeparator + students[i];

        }
        try {
            const NewClass = {
                name: className,
                date: dateTime,
                student: [{name:studentArray}]
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

    async insertStudent(Name) {
        try {
            const newStudent = {
               name: Name
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
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('AttendanceDB');

            Class = await db.collection('Classes').find({ 'name': classID }).toArray();
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

    async getStudentsByClassID(classID) {
        let Students = [];
        let Class;
        try {
            const client = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true });
            const db = client.db('AttendanceDB');

            Class = await db.collection('Classes').find({ '_id': classID});
            Students = Class.students;
            client.close();
        } catch (err) {
            console.log('There was a problem finding the specific students');
            throw err;
        }
        return Students;
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
}
module.exports = DBAbstraction;