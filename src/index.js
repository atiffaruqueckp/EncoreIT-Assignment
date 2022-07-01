const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const app = express();

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://taabish:lkmgsyjhwbQYgkvX@cluster0.cp3ka.mongodb.net/atif1234?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log('mongodb is connected'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(3000, function () {
    console.log('Express app running on port no 3000')
});