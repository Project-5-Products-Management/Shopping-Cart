const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const  mongoose  = require('mongoose');
const moment = require("moment")

const app = express();

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