const express = require('express')
const {ObjectId} = require('mongodb')
const {connectToDb, getDb} = require('./db')
var bodyParser = require('body-parser');

// init 
const app = express()
app.use(bodyParser.json());
// database connection 
let db 
connectToDb( (err) =>{
   if(!err){
    app.listen(3000,() => {
        console.log('listening 3000')
    })
    db = getDb()
   }
})
// database connection 


// routes 

app.get('/books',(req, res)=>{
    let books = []
    data = db.collection('books').find().forEach(book => books.push(book) )
    .then ( () => {
            res.status(200).json(books)
    }).catch( ()=> {
         res.status(500).json({mssg: 'Failed top fetch'})
    })
})
app.get('/books/:id',(req, res)=>{
    if(!ObjectId.isValid(req.params.id)){
        res.status(500).json({mssg: 'Invalid ID'})
    }
    db.collection('books').findOne({_id: ObjectId(req.params.id)}).then( doc =>{
       if(doc == null){
        res.status(404).json('Document Not Found')
       }
       res.status(200).json(doc)
    }).catch( ()=> {
         res.status(500).json({mssg: 'Failed top fetch'})
    })


})
app.post('/books', (req,res)=>{
    const book = req.body
    // res.json(book)
    db.collection('books').insertOne(book)
    .then( result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({err: 'Failed to store'})
    })

})