const express = require('express')
const cors= require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    app.get('/users', async(req, res)=>{
        const cursor = usersCollection.find();
        const result= await cursor.toArray();
        res.send(result)
    })

    app.get('/users/:id', async(req, res)=>{
      const id = req.params._id;
      const query= {_id: new ObjectId(id)}
      const user = await usersCollection.findOne(query);
      res.send(user)
    })

    app.post('/users', async(req,res)=>{
        const user= req.body;
        console.log('new user', user)
        const result = await usersCollection.insertOne(user);
        res.send(result)
    })

    app.put('/users/:id', async(req, res)=>{
      const id= req.params._id;
      const user= req.body;
      console.log(id, user);
      const filter = {_id: new ObjectId(id)}
      const options= {upsert : true }
      const updateUser = {
         $set: {
          name: user.name,
          age: user.age, 
          email: user.email,
          phone: user.phone
      }    
    }
      const result = await usersCollection.updateOne(filter, updateUser , options);
      res.send(result)
    })

    app.delete('/users/:id', async(req,res)=>{
      const id= req.params.id; 
      console.log('please delete from database ', id) 
      const query = {_id: new ObjectId(id) } ;
      const result = await usersCollection.deleteOne(query);
      res.send(result)
      
    })
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






