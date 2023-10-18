const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


//get overall
app.get('/', (req, res) => {
    res.send('Fashion and apparel server is running')
});

app.listen(port , () => {
    console.log(`Fashion and apparel server is running on port: ${port}`);
})

