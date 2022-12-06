let http = require('http');
let https = require('https');
let fs = require('fs');
let exec = require("child_process").exec;
let path = require('path');
const cookieParser = require("cookie-parser");
let express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
let port = 80;
let host = "localhost"
function page(reponce) {
    let cookie = {};
    Object.keys(reponce['cookies']).forEach(function (cle) {
        cookie['"' + cle + '"'] = '"' + reponce['cookies'][cle] + '"'
    });
    cookie = JSON.stringify(cookie);
    let post = {};
    if (reponce['post'] != undefined) {
        Object.keys(reponce['post']).forEach(function (cle) {
            post['"' + cle + '"'] = '"' + reponce['post'][cle] + '"'
        });
    }
    post = JSON.stringify(post);
    if (post == undefined) {
        post = "{}";
    }
    url = reponce.socket.parser.incoming.url;
    let textext = path.extname(url);
    let ext = textext.split('?');
    let query = {};
    if (ext[1] == undefined) {
        ext[1] = "";
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
                exec("structure\\php -c php.ini -f page/index/index.php " + query + " " + post + " " + cookie, (error, stdout, stderr) => {
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
        exec("structure\\php -c php.ini -f page/index" + url.replace("?", "") + " " + query + " " + post + " " + cookie, (error, stdout, stderr) => {
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
    reponce['cookies'] = request.cookies;
    page(reponce);
});
app.post('*', (request, reponce) => {
    reponce['post'] = request.body;
    reponce['cookies'] = request.cookies;
    page(reponce);
})
serveurhttp.listen(port, host, () => {
    console.log("serveur est ouver sur le port" + port);
});