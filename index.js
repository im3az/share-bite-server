const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.thriitw.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const availableFoodsCollection = client
      .db("shareBite")
      .collection("availableFoods");

    const requestedFoodsCollection = client
      .db("shareBite")
      .collection("requestedFoods");

    app.get("/availableFoods", async (req, res) => {
      // console.log(req.query.foodStatus);
      const query = { foodStatus: req.query.foodStatus };
      const cursor = availableFoodsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/availableFoods/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await availableFoodsCollection.findOne(query);
      res.send(result);
    });

    app.post("/availableFoods", async (req, res) => {
      const food = req.body;
      const result = await availableFoodsCollection.insertOne(food);
      res.send(result);
    });

    app.post("/requestedFoods", async (req, res) => {
      const newFood = req.body;
      const result = await requestedFoodsCollection.insertOne(newFood);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ShareBite server is running");
});

app.listen(port, () => {
  console.log(`ShareBite server is running on port:${port}`);
});
