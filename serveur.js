let http = require('http');
let https = require('https');
let fs = require('fs');
var exec = require("child_process").exec;
var path = require('path');
var express = require("express");
var app = express();
var port = 80;
var host = "localhost"
function page(reponce) {
    url = reponce.socket.parser.incoming.url;
    var textext = path.extname(url);
    var ext = textext.split('?');
    var query = {};
    if (ext[1] == undefined) {
        ext = "";
    }
    tablequery = ext[1].split("&");
    for (i = 0; i < tablequery.length; i++) {
        info = tablequery[i].split("=");
        if (info[1] == undefined) {
            info[1] = '';
        }
        query["\"" + info[0] + "\""] = '"' + info[1] + '"';
    }
    query = JSON.stringify(query);
    url = url.split(ext[1]).join("");
    if (url == "/") {
        fs.stat('page/index/index.php', (errphp, phpstat) => {
            if (errphp == null) {
                exec("structure\\php -c php.ini -f page/index/index.php " + query, (error, stdout, stderr) => {
                    reponce.end(stdout);
                });
            } else {
                fs.readFile('index.html', (errhtml, stdout) => {
                    if (errhtml) {
                        fs.readFile('page/index/404.php', (errphp, erreurstat) => {
                            reponce.end(erreurstat.toString());
                        });
                    } else {
                        reponce.end(stdout.toString());
                    }
                });
            }
        })
    } else if (ext[0] == ".php") {
        exec("structure\\php -c php.ini -f page/index" + url.replace("?", "") + " " + query, (error, stdout, stderr) => {
            reponce.end(stdout);
        });
    } else {
        fs.readFile("page/index" + url.replace("?", ""), (err, data) => {
            if (err) {
                fs.readFile('page/index/404.php', (errphp, erreurstat) => {
                    reponce.end(erreurstat.toString());
                });
            } else {
                reponce.end(data.toString());
            }
        });
    }
}
let serveurhttp = http.createServer(app);
app.get('*', (request, reponce) => {
    page(reponce);
});
app.post('*', (request, reponce) => {
    page(reponce);
})
serveurhttp.listen(port, host, () => {
    console.log("serveur est ouver sur le port" + port);
});