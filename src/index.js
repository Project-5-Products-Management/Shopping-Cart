const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const  mongoose  = require('mongoose');
const moment = require("moment")


/* Multer is a node. js middleware for handling multipart/form-data , which is primarily used for uploading files.
 NOTE: Multer will not process any form which is not multipart ( multipart/form-data ).*/

 
const multer= require("multer");

/* app.use(middleware) is a Global middleware which can be accessed by all routes in the application hence 
its name “Global”) and specific middleware (This is a middleware which applies to just a specific route)  */

const app = express(); 

app.use( multer().any())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://PankajKumar:ByiTM70OjwbN3c2l@cluster0.smhvx.mongodb.net/ProductsManagement-DB?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use(
    function(req,res,next){
        console.log(moment().format('LLLL'),req.ip,req.url)
        next()
    }
    
);
app.use('/', route);


app.listen(process.env.PORT || 3000, function () { 
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});