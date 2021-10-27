const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

//middleware

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello my first node fsfasfqfqe');
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yftux.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db("foodMaster");
        const usersCollection = database.collection("users");
        //GET API 
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })
        //Single USer Update API

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.findOne(query);
            res.send(result);
        })

        // POST API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log('got new user', req.body);
            console.log('added new user', result);
            res.json(result);

        })
        // Delete API
        app.delete('/users/:id', async (req, res) => {
            const user = req.params.id;
            const query = { _id: ObjectId(user) };
            const result = await usersCollection.deleteOne(query);
            console.log('deleting user', user);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log('listening to', port);
})
//40EaVOpY036j4xRf