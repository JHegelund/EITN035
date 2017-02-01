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

        cveID = data[0];
        article = data[1];
        comment = data[2];
        rating = data[3];
        newsType = data[6];
        publishedDate = data[4];
        tags = data[5];

        var sql = 'insert into News values (?, ?, ?, ?, ?, ?, ?)';
        var inserts = [article, cveID, rating, comment, newsType, publishedDate, tags];

        // Preparing query
        sql = mysql.format(sql, inserts);

        connection.query(sql, function(err, results) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
        });
}


module.exports.pushData = pushData;


