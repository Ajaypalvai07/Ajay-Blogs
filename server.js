const jsonServer = require('json-server');
const cors = require('cors');  // Importing the cors module
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Ensure db.json exists
const middlewares = jsonServer.defaults();

server.use(cors());  // Enable CORS
server.use(middlewares);  // Use default middlewares

server.use(router);  // Use the router for handling requests

// Set the port to 3000, or use environment port if available
const port = process.env.PORT || 3000; 
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
