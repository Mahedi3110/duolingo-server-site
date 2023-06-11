const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 7000;

//middleware
// app.use(cors())

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use(express.json())

// mongoDB
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.ti3vf32.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});





async function run() {
    try {
        // await client.connect();

        const userList = client.db("duolingo").collection("users");
        const classList = client.db("duolingo").collection("classes");

        // app.get('/category', async (req, res) => {
        //     const result = await components.find().toArray();
        //     res.send(result);
        // })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const exist = await userList.findOne(query);
            if (exist) {
                return res.send({ message: 'user already exist' })
            }
            const result = await userList.insertOne(user);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const result = await userList.find().toArray();
            res.send(result);
        })

        // app.post('/addList', async (req, res) => {
        //     const product = req.body;
        //     const result = await addList.insertOne(product);
        //     res.send(result);
        // })

        // app.get('/addList', async (req, res) => {
        //     const result = await addList.find().toArray();
        //     res.send(result);
        // })

        // app.delete('/addList/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await addList.deleteOne(query);
        //     res.send(result);
        // })

        // app.put('/addList/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) }
        //     const option = { upsert: true }
        //     const updatedValue = req.body;

        //     const value = {
        //         $set: {
        //             photo: updatedValue.photo,
        //             name: updatedValue.name,
        //             sellerName: updatedValue.sellerName,
        //             email: updatedValue.email,
        //             category: updatedValue.category,
        //             price: updatedValue.price,
        //             rating: updatedValue.rating,
        //             quantity: updatedValue.quantity,
        //             about: updatedValue.about
        //         }
        //     }
        //     const result = await addList.updateOne(filter, value, option);
        //     res.send(result);
        // })

        // app.delete('/addList/:mail', async (req, res) => {
        //     const mail = req.params.mail;
        //     const query = { email: mail }
        //     const result = await addList.deleteMany(query);
        //     res.send(result);
        // })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('server is running')
})


app.listen(port, () => {
    console.log(`Server is running on port: `)
})