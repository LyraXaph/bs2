const http = require('http');
const app = require('./app');

const port = process.env.PORT || 7777;

const server = http.createServer(app);

//import all of our models
require('./api/models/Gym');
require('./api/models/User');
require('./api/models/Review');

server.listen(port);