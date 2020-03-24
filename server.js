const express = require('express');
const app = express();
const path = require('path');
const https = require('https');

app.use(express.static(__dirname + '/dist/my-weather-app'));

app.listen(process.env.PORT || 8080);


app.use(function (req, res, next){
  if (req.headers['x-forwarded-proto'] === 'https') {
    res.redirect('http://' + req.hostname + req.url);
  } else {
    next();
  }
});

//PathLocationStrategy
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/my-weather-app/index.html'));
})

console.log('Console listening!');
