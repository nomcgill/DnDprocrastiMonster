const express = require('express');
const app = express();
const path = require('path');
app.use(express.static("public"));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
      return res.send(204);
    }
    next();
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});


app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running at 4000.');
});