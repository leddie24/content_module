var fs = require('fs');

function Static_contents(request, response) {
    var ext = request.url.split('.').pop();
    var encoding;
    var utfs = ['html', 'css'];
    var filetypes = {
    	html: 'text/html',
    	css: 'text/css',
    	jpg: 'image/jpg',
    	ico: 'image/x-icon'
    }
    var path;
    var encoding;

    // If the extension/path starts with '/', change the path to
    //  ./views and append .html
    if (ext.charAt(0) == '/') {
    	ext = 'html';
    	console.log('request url is', request.url);
    	path = request.url.substring(1, request.url.length);
    	path = './views/' + path + '.' + ext;
    } 
    // Otherwise, keep the path the same
    else { path = '.' + request.url; }

    // If filetype is text, add UTF8 encoding
    if (utfs.indexOf(ext) != -1) {	encoding = 'utf8'; } 
    else { encoding = ''; }

    console.log('requesturl is: ', request.url);
    console.log('path', path);
    console.log('encoding', encoding);
    console.log('ext', ext);
    console.log('filetype is: ', filetypes[ext]);

    fs.stat(path, function(err, stat) {
    	// if no errors, return 200 and serve page
	    if(err == null) {
		    fs.readFile(path, encoding, function (errors, contents){
		    	if (!errors) {
			        response.writeHead(200, {
			        	'Content-Type': filetypes[ext] 
			        });
			        response.write(contents); 
			        response.end();
		    	} else {
			        response.writeHead(404, {"Content-Type": "text/plain"});
					response.write("404 Not Found\n");
					response.end();
		    	}
		    });
	    } 
		// Page can't be found, serve 404
	    else if(err.code == 'ENOENT') {
	        console.log('File is gone', err.code);
	        response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found\n");
			response.end();
	    } else {
	        console.log('Some other error: ', err.code);
	    }
	});
};

module.exports = Static_contents;