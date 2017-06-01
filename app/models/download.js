// app/model/download.js

var fs = require('fs'),
    request = require('request');

module.exports = function(username, uri, callback){
	var destination;
	
	request(uri).pipe(fs.createWriteStream("./downloads/"+username+".png"))
    .on('close', function(){
        console.log("saving process is done!");
    });
	
	
	/*request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(destination)).on('close', callback);
  });*/
};