const express = require('express')
const cors= require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app= express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())




const uri = "mongodb+srv://doctorStrange:x9faSImGKIFwZwaO@cluster0.nlpzidc.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const database = client.db("usersDB");
    const usersCollection = database.collection("users");
    app.post('/users', async(req,res)=>{
        const user= req.body;
        console.log('new user', user)
        const result = await usersCollection.insertOne(user);
        res.send(result)
    })

    
    // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('simple crud server ')
})

app.listen(port, ()=>{
    console.log( `simple crud server is running on port , ${port}`)
})






