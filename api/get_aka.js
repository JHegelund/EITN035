var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    port     : '8889',
    user     : 'root',
    password : 'root',
    database : 'eitn35'
});

// var cveID = 'cve-2014-1032';
// var sql = 'select AKA from CVE where cveID = ' + connection.escape(cveID);

function get_aka(req, res){

            var result;
            var cveID = 'cve-2014-1032';
            var sql = 'select AKA from ?? where ?? = ?';
            var inserts = ['CVE', 'cveID', cveID];

            // Preparing query
            sql = mysql.format(sql, inserts);

            connection.query(sql, function(err, results) {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return;
                }

                console.log('AKA: ', results[0]);
                result = results[0];
            });


}

module.exports.get_aka = get_aka;
