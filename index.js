const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l0z6c5i.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const FashionCollection = client.db('fashionDB').collection('fashion');
    const cartCollection = client.db('fashionDB').collection('cart')

    app.get('/fashion', async(req, res) => {
        const cursor = FashionCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    //update
    app.get('/fashion/:id',async(req, res) => {
        const id = req.params.id;
        const query = {
            _id: new ObjectId(id)
        }
        const result = await FashionCollection.findOne(query)
        res.send(result)
    })
    

    //post for fashion DB
    app.post('/fashion', async(req, res) => {
        const newFashion= req.body;
        console.log(newFashion);
        const result = await FashionCollection.insertOne(newFashion);
        res.send(result)
    })

    //update
    app.put('/fashion/:id',async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const updatedProduct= req.body;
        const product = {
            $set:{
                name:updatedProduct.name,
                 type:updatedProduct.type,
                 description:updatedProduct.description,
                 price:updatedProduct.price,
                 rating:updatedProduct.rating,
                 brandName:updatedProduct.brandName,
                 photo : updatedProduct.photo
            }
        }
             
        const result = await FashionCollection.updateOne(filter,product,options);
        console.log(result);
        res.send(result);
        
    })
      
     //Get Cart
     app.get('/cart', async(req, res) => {
        const cursor = cartCollection.find()
        const result = await cursor.toArray()
        res.send(result)
      })

     //POST For Cart DB 
      app.post ('/cart', async(req, res) =>{
        const cart = req.body;
        console.log(cart);
        const result = await cartCollection.insertOne(cart);
        res.send(result)
      });
     

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




//get overall
app.get('/', (req, res) => {
    res.send('Fashion and apparel server is running')
});

app.listen(port , () => {
    console.log(`Fashion and apparel server is running on port: ${port}`);
})

