var express = require('express');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;

const fileName = '/app/data/info.txt';

app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
      case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
          return options.inverse(this);
  }
});

app.get('/', function(req, res) {
    readData().then(data => {
        return res.render(__dirname + '/views/dbadmin.hbs', {inputs: {content: ''}, result: data}); 
    })
    .catch(error => {
        return res.render(__dirname + '/views/dbadmin.hbs', {inputs: {content: ''}, result: error.message}); 
    });
  //  console.log("Application Accessed! / ");
});

app.post('/process', function (req, res) {
    var content = req.body.content?req.body.content:'';
    if (content) {
        fs.writeFile(fileName, content, (error) => {
             if (error) {
                return res.render(__dirname + '/views/dbadmin.hbs', {inputs: {content: content}, result: error.message}); 
             }
             return res.render(__dirname + '/views/dbadmin.hbs', {inputs: {content: ''}, result: content}); 
         });
     } else {
        readData().then(data => {
            return res.render(__dirname + '/views/dbadmin.hbs', {inputs: {content: ''}, result: data}); 
        }).catch(error => {
        return res.render(__dirname + '/views/dbadmin.hbs', {inputs: {content: ''}, result: error.message}); 
        });
    }
   // console.log("Application Accessed! /process");
})

function readData() {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                reject(new Error(err.message));
                return;
            } 
            resolve(data);
          });
    })
}

app.get('/health-check', function(req, res) {
    return res.status(200).send('<h2>Successfully used CI/CD to update the application!!</h2>'); 
});

app.listen(port, function() {
    console.log("server is running on port : " + port);
  }).on("error", function(err) {
    console.log('error occured : ' + err.message);
  });