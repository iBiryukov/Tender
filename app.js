var express = require('express');
var app = express();

app.get('/hello', function(req, res){
    res.send("Hello");
});

app.listen(3000);
console.log("Listening on port 3000");