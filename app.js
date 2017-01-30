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
var util = require('util');
var twit = require('twitter');
var client = new twit({
    consumer_key: 'd5ZLgfJJPVCpLHRRlQfWz5VR5',
    consumer_secret: 'AZng4nqOX2gt8IG2b4BeNoqwfyLmiQIlCQnNKuS6OwgWRCHbDq',
    access_token_key: '741713163574509568-PalYvOA2P7hY7YovXCZMNKtJQZHuVD6',
    access_token_secret: 'OrBPIOfGtquS8ryEAB9AxkdY1dpOmScJkKBL4yDSS2VJZ'
});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

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
var result = [];
var html;

//Creating mysql connection variable
var mysql      = require('mysql');
var connection = mysql.createConnection({
      host     : '127.0.0.1',
      port     : '8889',
      user     : 'root',
      password : 'root',
      database : 'eitn35'
  });

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

/* Search on Google */

app.post('/search', function (req, res) {
    
  sources = getTrueKeys(req.body.sourceArray);
  var searchQuery = req.body.searchQuery;

  google.resultsPerPage = 40

  // Check if search is for CVE or AKA
  var stringCompare = searchQuery.substring(0, 3);
  stringCompare = stringCompare.toLowerCase();

  if(stringCompare == 'cve'){

    // Get AKA to given CVE, if exist in database
    var cveID = searchQuery.toLowerCase();

    var sql = 'select AKA from ?? where ?? = ?';
    var inserts = ['CVE', 'cveID', cveID];

    // Preparing query
    sql = mysql.format(sql, inserts);

    connection.query(sql, function(err, results) {
      if (err) {
          console.error('error connecting: ' + err.stack);
           return;
      }

      var akaResult = results.length;

      // If no result from database, search without AKA
      if(akaResult == 0){
        // Google search for sourceStrings + CVE
        google(sourceString() + ' ' + searchQuery, function (err, result){
          // Get all articles from database
            var sql = 'select article from ??';
            var inserts = ['News'];

            // Preparing query
            sql = mysql.format(sql, inserts);

            connection.query(sql, function(err, results) {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                   return;
                }

                list = [];
                dbArticles = [];
                var list2 = result.links;
                var a = list2.length;
                var j = results.length;

                // If no articles in database, show all results
                if(j == 0){
                  list = result.links;

                  // Else check if any article in database matches search result
                } else {

                  for(var k = 0; k < j; k++){
                    dbArticles.push(results[k].article);
                  }

                  // Push articles from searchResult if not exist in database already
                  for(var i = 0; i < a; i++){
                    if(dbArticles.indexOf(list2[i].link) < 0){
                      list.push(list2[i]);
                    }
                  }
                }
                res.json(list);
            });
        })

        // If AKA result from database, search with AKA
      } else {

        var AKA = results[0].AKA;
      
        // Google search for sourceStrings + AKA + CVE
        google(sourceString() + ' ' + AKA + ' ' + searchQuery, function (err, result){
          if (err) console.error(err)

            // Get all articles from database
            var sql = 'select article from ??';
            var inserts = ['News'];

            // Preparing query
            sql = mysql.format(sql, inserts);

            connection.query(sql, function(err, results) {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                   return;
                }

                list = [];
                dbArticles = [];
                var list2 = result.links;
                var a = list2.length;
                var j = results.length;

                // If no articles in database, show all results
                if(j == 0){
                  list = result.links;

                  // Else check if any article in database matches search result
                } else {

                  for(var k = 0; k < j; k++){
                    dbArticles.push(results[k].article);
                  }

                  // Push articles from searchResult if not exist in database already
                  for(var i = 0; i < a; i++){
                    if(dbArticles.indexOf(list2[i].link) < 0){
                      list.push(list2[i]);
                    }
                  }
                }
                res.json(list);    
            });
        })
      }
    });

    // If search not for CVE, search for AKA
  } else {

    var str = searchQuery;
    var AKA = str.toLowerCase();

    // Get CVE to given AKA, if exist in database
    var sql = 'select cveID from ?? where ?? = ?';
    var inserts = ['CVE', 'AKA', AKA];

    // Preparing query
    sql = mysql.format(sql, inserts);

    connection.query(sql, function(err, results) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }

      var cveResult = results.length;

      // If no result from database, search without CVE
      if(cveResult == 0){
        // Google search for sourceStrings + AKA
        google(sourceString() + ' ' + searchQuery, function (err, result){
          // Get all articles from database
            var sql = 'select article from ??';
            var inserts = ['News'];

            // Preparing query
            sql = mysql.format(sql, inserts);

            connection.query(sql, function(err, results) {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                   return;
                }

                list = [];
                dbArticles = [];
                var list2 = result.links;
                var a = list2.length;
                var j = results.length;

                // If no articles in database, show all results
                if(j == 0){
                  list = result.links;

                  // Else check if any article in database matches search result
                } else {

                  for(var k = 0; k < j; k++){
                    dbArticles.push(results[k].article);
                  }

                  // Push articles from searchResult if not exist in database already
                  for(var i = 0; i < a; i++){
                    if(dbArticles.indexOf(list2[i].link) < 0){
                      list.push(list2[i]);
                    }
                  }
                }
                res.json(list);
            });
        })

        // If CVE result from database, search with CVE
      } else {

        var CVE = results[0].cveID;

        // Google search for sourceStrings + AKA + CVE
        google(sourceString() + ' ' + searchQuery + ' ' + CVE, function (err, result){
          if (err) console.error(err)

            // Get all articles from database
            var sql = 'select article from ??';
            var inserts = ['News'];

            // Preparing query
            sql = mysql.format(sql, inserts);

            connection.query(sql, function(err, results) {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return;
                }

                list = [];
                dbArticles = [];
                var list2 = result.links;
                var a = list2.length;
                var j = results.length;

                // If no articles in database, show all results
                if(j == 0){
                  list = result.links;

                  // Else check if any article in database matches search result
                } else {

                  for(var k = 0; k < j; k++){
                    dbArticles.push(results[k].article);
                  }

                  // Push articles from search result if not exist in database already
                  for(var i = 0; i < a; i++){
                    if(dbArticles.indexOf(list2[i].link) < 0){
                      list.push(list2[i]);
                    }
                  }
                }
                res.json(list);
            });
        })
      }
    });
  }
})

/** Search on Twitter **/

app.post('/searchTwitter', function (req, res) {

    var searchQuery = req.body.searchQuery;

    if(sources.indexOf('https://twitter.com/') >= 0){
        
        var params = {q: searchQuery, lang:'en', resultType: 'mixed', exclude:'retweets', count: 40};
            client.get('search/tweets', params, function(error, data, response) {
                if (!error) {
                    var tweets = data.statuses;
                    res.json(tweets);
                }
        
        
            });
        }
})

/* Save to Database */

app.post('/api', function (req, res) {
    var dbData = [];
    dbData.push(req.body.url);
    dbData.push(req.body.com);
    dbData.push(req.body.rate);
    dbData.push(req.body.date);
    dbData.push(req.body.tags);
    dbData.push(req.body.type);
    
    dbpush.pushData(req, dbData);

})

/* Get content from site */

app.post('/unfluff', function (req, res) {
    var url =  req.body.unfluffUrl;
    var dataContent = [];

    /* Get CVE information */

    if (url.toLowerCase().indexOf("web.nvd.nist.gov/view/vuln/") >= 0){

        request(url, function (error, response, body) {

            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(body);

                /*Get CVE title */

                var title = $('div.vuln-detail').find('h3').text();

                /*Get CVE summary*/

                var summary =  $('#BodyPlaceHolder_cplPageContent_plcZones_lt_zoneCenter_VulnerabilityDetail_VulnFormView').find('h3').text();

                /*Get Cve Date*/

                var cveDate =  $('#BodyPlaceHolder_cplPageContent_plcZones_lt_zoneCenter_VulnerabilityDetail_VulnFormView').find('div.row').first().text();
                cveDate = cveDate.replace(/[\r\n]/g, '');
                cveDate = cveDate.replace(/  +/g, ' ');
                cveDate = cveDate.trim();
                if(!cveDate) {
                    cveDate = "No info";
                }
                /*Get CVSS20 Score */

                var cvss20 =  $('#BodyPlaceHolder_cplPageContent_plcZones_lt_zoneCenter_VulnerabilityDetail_VulnFormView_Vuln2CvssPanel').find('div.row').first().text();
                cvss20 = cvss20.replace(/[\r\n]/g, '');
                cvss20 = cvss20.replace(/  +/g, ' ');
                cvss20 = cvss20.trim();
                if(!cvss20) {
                    cvss20 = "No info";
                }
                /* overview*/
                var overview = $('div.vuln-detail').find('h4:contains("Overview")').next().text();
                if(!overview){
                }
                /*Get CVSS30 Score */

                var cvss30 =  $('#BodyPlaceHolder_cplPageContent_plcZones_lt_zoneCenter_VulnerabilityDetail_VulnFormView_Vuln3CvssPanel').find('div.row').first().text();
                cvss30 = cvss30.replace(/[\r\n]/g, '');
                cvss30 = cvss30.replace(/  +/g, ' ');
                cvss30 = cvss30.trim();
                if(!cvss30) {
                    cvss30 = "No info";
                }
                dataContent.push({
                    "title"         :   title,
                    "URL"           :   url,
                    "Summary"       :   summary,
                    "Overview"      :   overview,
                    "cveDate"       :   cveDate,
                    "cvss20"        :   cvss20,
                    "cvss30"        :   cvss30
                });
                res.json(dataContent);
            } else {
                console.log("We’ve encountered an error: " + error);
            }

        });

    } else {

        /* Get content from site*/

        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(body);
                var html = $.html();
                data = extractor(html, 'en');
                var cleanText = data.text.replace(/[\r\n]/g, '');
                dataContent.push({
                    "title": data.title,
                    "date": data.date,
                    "tags": data.tags,
                    "description": data.description,
                    "publisher": data.publisher,
                    "text": cleanText
                });
                res.json(dataContent);

            } else {
                console.log("We’ve encountered an error: " + error);
            }
        });
    }

})

module.exports = app;
