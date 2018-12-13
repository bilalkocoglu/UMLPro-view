const express = require('express');

const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/uml-pro-view'));

app.get('*', function (req,res) {
  res.sendFile(path.join(__dirname + '/dist/uml-pro-view/index.html'))
});

app.listen(process.env.PORT || 8080);
