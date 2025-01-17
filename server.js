const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Ensure this file exists in the root directory
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Add CORS headers
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

server.use(router);

// Set the port
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
