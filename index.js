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

    // available food api
    app.get("/availableFoods", async (req, res) => {
      let query = {};
      if (req.query?.foodStatus) {
        query = { foodStatus: req.query.foodStatus };
      }

      // if (req.query.donatorEmail) {
      //   query = { donatorEmail: req.query.donatorEmail };
      // }
      const cursor = availableFoodsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/manageMyFoods", async (req, res) => {
      let query = {};
      if (req.query.donatorEmail) {
        query = { donatorEmail: req.query.donatorEmail };
      }
      const cursor = availableFoodsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/myFoodRequest", async (req, res) => {
      let query = { requesterEmail: req.query.requesterEmail };
      // if (req.query.requesterEmail) {
      //   query = { requesterEmail: req.query.requesterEmail };
      // }
      const cursor = requestedFoodsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

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

    app.get("/manageSingleFood/:id", async (req, res) => {
      const id = req.params.id;
      const query = { foodId: id };
      const result = await requestedFoodsCollection.findOne(query);
      res.send(result);
    });

    app.put("/manageSingleFood/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateFood = {
        $set: {
          foodStatus: data.foodStatus,
        },
      };

      const result = await availableFoodsCollection.updateOne(
        filter,
        updateFood,
        options
      );

      res.send(result);
    });

    app.post("/availableFoods", async (req, res) => {
      const food = req.body;
      const result = await availableFoodsCollection.insertOne(food);
      res.send(result);
    });

    app.get("/updateFoods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await availableFoodsCollection.findOne(query);
      res.send(result);
    });

    app.put("/updateFoods/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateFood = {
        $set: {
          foodName: data.foodName,
          foodImage: data.foodImage,
          foodQuantity: data.foodQuantity,
          pickupLocation: data.pickupLocation,
          expiredDateTime: data.expiredDateTime,
          additionalNotes: data.additionalNotes,
          foodStatus: data.foodStatus,
        },
      };

      const result = await availableFoodsCollection.updateOne(
        filter,
        updateFood,
        options
      );
      res.send(result);
    });

    app.delete("/deleteFood/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await availableFoodsCollection.deleteOne(query);
      res.send(result);
    });

    // requested food api

    app.post("/requestedFoods", async (req, res) => {
      const newFood = req.body;
      const result = await requestedFoodsCollection.insertOne(newFood);
      res.send(result);
    });

    app.delete("/myFoodDelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await requestedFoodsCollection.deleteOne(query);
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
