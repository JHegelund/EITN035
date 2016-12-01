var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var google = require('google');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


// view engine setup
//  app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', routes);
app.use(logger('dev')); 
app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser());
 app.use(express.static(path.join(__dirname, 'public')));

var sources = [];
var list = [];

var sourceString = function(){
  var string = 'site: ';
  for (var i = 0; i < sources.length -1; ++i) {
    string = string.concat(sources[i] +' | ');
  }
  string = string.concat(sources[sources.length-1]);

  return string;
}

app.post('/search', function (req, res) {

  sources= Object.keys(req.body.sourceArray);
  var searchQuery = req.body.searchQuery;

  google.resultsPerPage = 25
   var nextCounter = 0

    console.log(sourceString() + ' ' + searchQuery);
     google(sourceString() + ' ' + searchQuery, function (err, res){
    if (err) console.error(err)
       
    for (var i = 0; i < res.links.length; ++i) {
      var link = res.links[i];
      console.log(link.title + ' - ' + link.href)
      console.log(link.description + "\n")
    }

    list = res.links;

    /*if (nextCounter < 4) {
      nextCounter += 1
      if (res.next) res.next()
    }*/
  })



})

app.get('/searchReturn', function (req, res) {


    res.json(list);

})

module.exports = app;
