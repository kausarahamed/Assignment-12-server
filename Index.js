const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zhibv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const airCollection = client.db("aircool").collection("air");
    app.get("/purchase/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await airCollection.findOne(query);
      res.send(result);
    });
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = airCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/order", async (req, res) => {
      const product = req.body;
      const result = await airCollection.insertOne(product);
      res.send(result);
    });
  } finally {
    //    client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running ac Server");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
