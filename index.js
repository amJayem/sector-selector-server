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
        app.get('/sectors', async(req,res)=>{
            const sectors = await sectorCollection.find({}).toArray();
            // console.log(sectors);
            res.send(sectors);
        })

        app.post('/users', async(req, res)=>{
          const userData = req.body;
          console.log(userData);
          const result = await userCollection.insertOne(userData);

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
  