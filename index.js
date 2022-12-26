const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 4000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.42e2srw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async() =>{
    
    try{
        const sectorCollection = client.db('sector-selector').collection('sectors');
        const userCollection = client.db('sector-selector').collection('userData');

        // getting data from db
        app.get('/sectors', async(req,res)=>{
            const sectors = await sectorCollection.find({}).toArray();
            // console.log(sectors);
            res.send(sectors);
        });

        // posting data to db
        app.post('/users', async(req, res)=>{
          const userData = req.body;
          // console.log(userData);
          const result = await userCollection.insertOne(userData);

          res.send(result);
        });

        //getting user data from db
        app.get('/user-data', async(req,res)=>{
          const userData = await userCollection.find({}).toArray();
          // console.log(userData);
          res.send(userData);
        });

        // delete use data from db
        app.delete('/delete-user/:id', async(req,res)=>{
          const id = req.params.id;
          // console.log(id);
          const filter = {_id: ObjectId(id)}
          const result = await userCollection.deleteOne(filter);

          res.send(result);
        });

        // getting one user data
        app.get('/user/:id', async(req, res)=>{
          const id = req.params.id;
          const filter = { _id: ObjectId(id)};
          const result = await userCollection.findOne(filter);
          // console.log(result);

          res.send(result);
        })

    }
    finally{}
}

run().catch((e) => {
    console.error("run error => ", e.message);
  });
  
  app.get("/", (req, res) => {
    res.send("sector-selector server is running...");
  });
  
  app.listen(port, () => {
    console.log("server running on: ", port);
  });
  