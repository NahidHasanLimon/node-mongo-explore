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
    const page = req.query.p || 0
    const booksPerPage = 2 

    let books = []
    data = db.collection('books').find()
    .sort({author : 1})
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(book => books.push(book) )
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
    
    db.collection('books').insertOne(book)
    .then( result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({err: 'Failed to store'})
    })

})
app.delete('/books/:id',(req, res)=>{
    if(!ObjectId.isValid(req.params.id)){
        res.status(500).json({mssg: 'Invalid ID'})
    }
    db.collection('books').deleteOne({_id: ObjectId(req.params.id)}).then( doc =>{
       if(doc == null){
        res.status(404).json('Document Not Found')
       }
       res.status(200).json(doc)
    }).catch( ()=> {
         res.status(500).json({mssg: 'Failed top delete'})
    })
})
app.patch('/books/:id',(req, res)=>{
    const book = req.body
    if(!ObjectId.isValid(req.params.id)){
        res.status(500).json({mssg: 'Invalid ID'})
    }
    db.collection('books').updateOne({_id: ObjectId(req.params.id)}, {$set: book } ).then( result =>{
       if(result == null){
        res.status(404).json('Document Not Found')
       }
       res.status(200).json(result)
    }).catch( ()=> {
         res.status(500).json({mssg: 'Update Failed'})
    })
})