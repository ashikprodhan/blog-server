const express = require('express')


const { MongoClient } = require('mongodb');
var cors = require('cors')
var bodyParser = require('body-parser')
const ObjectID = require('mongodb').ObjectID;

require('dotenv').config()



const app = express()
const port = process.env.PORT || 5000;
// console.log(process.env.DB_USER);

app.use(cors())
app.use(bodyParser.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3tdcv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const blogCollection = client.db("blogdb").collection("allBlog");
    const adminCollection = client.db("blogdb").collection("admin");
    // perform actions on the collection objectr
   console.log('error ',err);

    app.post('/addAdmin',(req,res)=>{
         newAdmin = req.body;
         console.log(newAdmin);
         adminCollection.insertOne(newAdmin)
          .then(result =>{
              console.log('inserted count',result.insertedCount)
              res.send(result.insertedCount > 0)
          })
     })

    app.post('/addBlog', (req, res) => {
        const newBlog = req.body;

        //  console.log('hello blog', newBlog);
        blogCollection.insertOne(newBlog)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)

            })
    })





    //   client.close();
});


// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })


app.listen(port)