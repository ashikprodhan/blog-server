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


   // all blog posts
   app.get('/allBlog', (req, res) => {
    blogCollection.find()
     .toArray((err,blogs) =>{
         res.send(blogs)
         console.log("blog froom database");
     })
})
// find specific blog collection
 app.get('/allBlog/:id',(req,res)=>{
    const id = ObjectID(req.params.id)
    console.log(id);
     blogCollection.findOne({_id:id})
      .then((result)=>{
        res.send(result)
          console.log(" getting please wait ",result,"error:",err);
         
      })

 })
 app.delete('/delete/:id',(req,res)=>{
    const id=ObjectID(req.params.id)
    console.log(id);
    
    blogCollection.findOneAndDelete({_id:id})
    .then(documents => {
        console.log('documents deleted',documents);
        res.send(!! documents.value);
    })
})

// isAdmin 
app.post('/isAdmin',(req,res)=>{
    //  console.log('admin send korlam',req.body.email);
    adminCollection.find({admin:req.body.email})
    .toArray((err, admins) => {
        console.log('asol admin',admins);
        res.send(admins.length > 0);
    })
})


    //   client.close();
});





app.listen(port)