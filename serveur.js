let http = require('http');
let https = require('https');
let fs = require('fs');
const cookieParser = require("cookie-parser");
var exec = require("child_process").exec;
var path = require('path');
var express = require("express");
const session = require("express-session")
var app = express();
app.use(cookieParser());
port = 80
host = 'localhost'
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))
function page(request, reponce) {
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
    let usersesion = {};
    Object.keys(reponce['session']).forEach(function (cle) {
        if (cle != 'cookie') {
            usersesion['"' + cle + '"'] = '"' + reponce['session'][cle] + '"'
        }
    })
    usersesion = JSON.stringify(usersesion);
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
                exec("structure\\php -c php.ini -f page/index/index.php " + query + " " + post + " " + cookie + " " + usersesion + " " + reponce['iduser'], (error, stdout, stderr) => {
                    fs.readFile('data_session/' + reponce['iduser'] + ".data", (errdata, dataphp) => {
                        fs.unlink('data_session/' + reponce['iduser'] + ".data", (err) => {
                            if (!err) {
                                jsondata = JSON.parse(dataphp.toString('utf-8'));
                                Object.keys(jsondata.session).forEach((cls) => {
                                    request.session[cls] = jsondata.session[cls];
                                });
                                Object.keys(jsondata.cookie).forEach((cls) => {
                                    reponce.cookie(cls, jsondata.cookie[cls]);
                                })
                            }
                            reponce.write(stdout);
                            reponce.end()
                        });
                    });
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
        exec("structure\\php -c php.ini -f page/index" + url.replace("?", "") + " " + query + " " + post + " " + cookie + " " + usersesion + " " + reponce['iduser'], (error, stdout, stderr) => {
            fs.readFile('data_session/' + reponce['iduser'] + ".data", (errdata, dataphp) => {
                fs.unlink('data_session/' + reponce['iduser'] + ".data", (err) => {
                    if (!err) {
                        jsondata = JSON.parse(dataphp.toString('utf-8'));
                        Object.keys(jsondata.session).forEach((cls) => {
                            request.session[cls] = jsondata.session[cls];
                        });
                        Object.keys(jsondata.cookie).forEach((cls) => {
                            reponce.cookie(cls, jsondata.cookie[cls]);
                        })
                    }
                    reponce.write(stdout);
                    reponce.end()
                });
            });
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
    reponce['iduser'] = request.sessionID;
    reponce['session'] = request.session;
    page(request, reponce);
});
app.post('*', (request, reponce) => {
    reponce['post'] = request.body;
    reponce['iduser'] = request.sessionID;
    reponce['session'] = request.session;
    reponce['cookies'] = request.cookies;
    page(request, reponce);
})
serveurhttp.listen(port, host, () => {
    console.log("serveur est ouver sur le port" + port);
});