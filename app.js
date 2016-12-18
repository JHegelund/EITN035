var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var google = require('google');
var extractor = require('unfluff');
var fetchUrl = require("fetch").fetchUrl;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var dbcall = require('./api/get_aka');
var dbpush = require('./api/push_data');






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
var data = [];
var html;

var sourceString = function(){
  var string = 'site: ';
  for (var i = 0; i < sources.length -1; ++i) {
    string = string.concat(sources[i] +' | ');
  }
  string = string.concat(sources[sources.length-1]);

  return string;
}

function getTrueKeys(obj) {
    var ret = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === true) {
            ret.push(key);
        }
    }
    return ret;
}

app.post('/search', function (req, res) {


  sources= getTrueKeys(req.body.sourceArray);
  var searchQuery = req.body.searchQuery;

  google.resultsPerPage = 25
   var nextCounter = 0

    console.log(sourceString() + ' ' + searchQuery);
     google(sourceString() + ' ' + searchQuery, function (err, res){
    if (err) console.error(err)
       
    for (var i = 0; i < res.links.length; ++i) {
      var link = res.links[i];
      /*console.log(link.title + ' - ' + link.href)
      console.log(link.description + "\n")*/
    }
         /*fetchUrl("https://www.npmjs.com/package/unfluff", function(error, meta, body){
         });

         data = extractor.lazy(html, 'en');

         // Access whichever data elements you need directly.
         console.log(data);
         console.log(data.softTitle);
         console.log(data.date);
         console.log(data.copyright);
         console.log(data.author);
         console.log(data.publisher);
         console.log(data.text);
         console.log(data.image);
         console.log(data.tags);
         console.log(data.videos);
         console.log(data.canonicalLink);
         console.log(data.lang);
         console.log(data.description);
         console.log(data.favicon);*/
         
         list = res.links;



         /*if (nextCounter < 4) {
           nextCounter += 1
           if (res.next) res.next()
         }*/
  })



})

app.get('/searchReturn', function (req, res) {

    /* var data = extractor(my_html_data, 'en'); */


    res.json(list);
    

})

app.post('/api', function (req, res) {

    console.log(req.body.url);
    var url = req.body.url;
    dbpush.pushData(req, url);

    
    dbcall.get_aka(req, res);

})


module.exports = app;
