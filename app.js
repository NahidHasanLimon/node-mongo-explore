const express = require('express')
const {ObjectId} = require('mongodb')
const {connectToDb, getDb} = require('./db')
// init 
const app = express()
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
    data = db.collection('books').findOne({_id: ObjectId(req.params.id)}).then( doc =>{
       if(doc == null){
        res.status(404).json('Document Not Found')
       }
       res.status(200).json(doc)
    }).catch( ()=> {
         res.status(500).json({mssg: 'Failed top fetch'})
    })
})