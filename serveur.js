let http = require('http');
let https = require('https');
let fs = require('fs');
var exec = require("child_process").exec;
var path = require('path');
var express = require("express");
var app = express();
function page(reponce){
    url = reponce.socket.parser.incoming.url;
    var textext = path.extname(url);
    var ext = textext.split('?');
    url = url.split(ext[1]).join("");
    if(url=="/"){
        fs.stat('page/index/index.php',(errphp, phpstat)=>{
            if(errphp == null){
                exec("php -c php.ini -f page/index/index.php",(error, stdout, stderr)=>{
                    reponce.send(stdout);
                });
            }else{
                fs.readFile('index.html',(errhtml,stdout)=>{
                    if(errhtml){
                        reponce.send("erreur");
                    }else{
                        reponce.send(stdout.toString());
                    }
                });
            }
        })
    }else if(ext[0]==".php"){
        exec("php -c php.ini -f page/index"+url.replace("?",""),(error, stdout, stderr)=>{
            reponce.send(stdout);
        });
    }else{
        fs.readFile("page/index"+url.replace("?",""),(err,data) => {
            if(err){
                reponce.send("erreur");
            }else{
                reponce.send(data.toString());
            }
        });
    }
    responce.end();
}
let serveurhttp =http.createServer(app);
app.get('*',(request,reponce)=>{
    page(reponce);
});
app.post('*',(request,reponce)=>{
    page(reponce);
})
serveurhttp.listen("80");