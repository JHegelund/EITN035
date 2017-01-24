var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var google = require('google');
var extractor = require('unfluff');
var cheerio = require('cheerio');
var request = require('request');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var dbcall = require('./api/get_aka');
var dbpush = require('./api/push_data');



/** Engine Setup **/

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', routes);
app.use(logger('dev')); 
app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser());
 app.use(express.static(path.join(__dirname, 'public')));


/** Public Variables **/

var sources = [];
var list = [];
var html;



/** Sorting Methods **/


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




/* HTTP requests */


app.post('/search', function (req, res) {


  sources= getTrueKeys(req.body.sourceArray);
  var searchQuery = req.body.searchQuery;

  google.resultsPerPage = 25
   var nextCounter = 0

    console.log(sourceString() + ' ' + searchQuery);
     google(sourceString() + ' ' + searchQuery, function (err, response){
    if (err) console.error(err)


         list = response.links;


         /*if (nextCounter < 4) {
           nextCounter += 1
           if (res.next) res.next()
         }*/
         res.json(list);
  })





})


app.post('/api', function (req, res) {
    var dbData = [];
    dbData.push(req.body.url);
    dbData.push(req.body.com);
    dbData.push(req.body.rate);
    dbData.push(req.body.date);
    dbData.push(req.body.tags);

    /** dbData.push({
      "url" : req.body.url,
      "comment": req.body.com,
      "rating" : req.body.rate,
      "date" : req.body.date,
      "tags" : req.body.tags
      }); **/
    
    dbpush.pushData(req, dbData);


    dbcall.get_aka(req, res);

})

app.post('/unfluff', function (req, res) {
    var url =  req.body.unfluffUrl;
     var dataContent=[];
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var html = $.html();
            data = extractor(html, 'en');
            var cleanText =  data.text.replace(/[\r\n]/g, '');
            dataContent.push({
                "title" : data.title,
                "date": data.date,
                "tags": data.tags,
                "description": data.description,
                "publisher" : data.publisher,
                "text": cleanText
            });
            console.log(dataContent + "dateTime" + date);
            res.json(dataContent);

        } else {
            console.log("We’ve encountered an error: " + error);
        }
    });
})

module.exports = app;
