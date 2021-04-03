const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mojnu:ineedjob@cluster0.jvd1e.mongodb.net/question?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

client.connect(err => {
  const questionCollection = client.db("question").collection("mcq");
  //read question
  app.get('/question', (req, res) => {
    questionCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })
  //insert question
  app.post("/addQuestion", (req, res) => {
    const question = req.body;
    questionCollection.insertOne(question)
    .then(result => {
      console.log('question added successfully');
      res.redirect('/');
    })
  })
  //delete question
  app.delete('/delete/:id', (req, res) => {
    questionCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  })
  //update mcq
  app.get('/mcq/:id', (req, res) => {
    questionCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      res.send(documents[0]);
    })
  })
   app.patch('/update/:id', (req, res) => {
        questionCollection.updateOne({ _id: ObjectId(req.params.id)}, 
        {
            $set: {question: req.body.question, option1: req.body.option1, option2: req.body.option2, option3: req.body.option3, option4: req.body.option4}
        })
        .then(result =>{
            // console.log(result);
            res.send(result.modifiedCount > 0);
        })
    })

});

app.listen(3000);