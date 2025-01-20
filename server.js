const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');  // Ensure db.json exists
const middlewares = jsonServer.defaults();

// Enable CORS for a specific origin (replace with your actual Angular app URL on Render)
server.use(cors({
  origin: 'https://ajay-blogs.onrender.com'  // Replace with your actual URL
}));

server.use(middlewares);  // Use default middlewares
server.use(router);  // Use the router for handling requests

// Set the port to 3000, or use the environment port if available
server.listen(process.env.PORT || 10000,'0.0.0.0',  () => {
  console.log('JSON Server is running');
});
