// $ npm install mysql !!!!

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    port     : '8889',
    user     : 'root',
    password : 'root',
    database : 'eitn35'
});


function pushData(req,res){
        var data = res;

        cveID = 'cve-2014-1032';
        link = data[0];
        comment = data[1];
        rating = data[2];
        attackType = null;
        newsType = null;
        publishedDate = data[3];
        tags = data[4];

        var sql = 'insert into News values (?, ?, ?, ?, ?, ?, ?, ?)';
        var inserts = [cveID, link, rating, comment, attackType, newsType, publishedDate, tags];

        // Preparing query
        sql = mysql.format(sql, inserts);

        connection.query(sql, function(err, results) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }

            console.log('AKA: ', results[0]);
        });
}


module.exports.pushData = pushData;


