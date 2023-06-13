const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const stripe = require('stripe')(process.env.PS)
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
        const selectList = client.db("duolingo").collection("select")

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

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedValue = req.body;

            const value = {
                $set: {
                    status: updatedValue?.status
                }
            }
            const result = await userList.updateOne(filter, value, option);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userList.deleteOne(query);
            res.send(result);
        })

        app.post('/classes', async (req, res) => {
            const classes = req.body;
            const result = await classList.insertOne(classes);
            res.send(result);
        })

        app.get('/classes', async (req, res) => {
            const result = await classList.find().toArray();
            res.send(result);
        })

        app.delete('/classes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await classList.deleteOne(query);
            res.send(result);
        })

        app.put('/classes/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedValue = req.body;

            const value = {
                $set: {
                    photo: updatedValue?.photo,
                    name: updatedValue?.name,
                    instructorName: updatedValue?.instructorName,
                    email: updatedValue?.email,
                    price: parseInt(updatedValue?.price),
                    about: updatedValue?.about,
                    status: updatedValue?.status,
                    availableSeats: parseInt(updatedValue?.availableSeats)
                }
            }
            const result = await classList.updateOne(filter, value, option);
            res.send(result);
        })

        app.post('/select', async (req, res) => {
            const select = req.body;
            const result = await selectList.insertOne(select);
            res.send(result);
        })

        app.get('/select', async (req, res) => {
            const result = await selectList.find().toArray();
            res.send(result);
        })

        app.delete('/select/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await selectList.deleteOne(query);
            res.send(result);
        })

        app.put('/select/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedValue = req.body;

            const value = {
                $set: {
                    status: updatedValue?.status
                }
            }
            const result = await selectList.updateOne(filter, value, option);
            res.send(result);
        })

        //payment
        app.post('/create-payment-intent', async (req, res) => {
            const { price } = req.body;
            const amount = price * 100;
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card']
            });
            res.send({
                clientSecret: paymentIntent.client_secret
            })
        })

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