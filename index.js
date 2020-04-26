const app = require('./app');
var http = require('http');
require('dotenv').config();
var port = normalizePort(process.env.port || '8080');
app.set('port', port);

var server = http.createServer(app);

server.listen(port);

// eslint-disable-next-line no-console
console.log('Server listening on port ' + port);

function normalizePort(val) {
	var port = parseInt(val, 10);
	if (isNaN(port)) {
		// named pipe
		return val;
	}
	if (port >= 0) {
		// port number
		return port;
	}
	return false;
}