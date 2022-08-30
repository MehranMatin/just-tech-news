// Server for the Just Tech News project

// Dependencies
// path module
const path = require('path');
// Express.js server
const express = require('express');
// All routes as defined in the controllers folder
const routes = require('./routes');
// Sequelize connection to database
const sequelize = require('./config/connection');
// Handlebars template engine for front-end
const exphbs = require('express-handlebars');

// Initialize handlebars for the html templates, using the custom helpers
const hbs = exphbs.create({});

// Initialize the server
const app = express();
// Define the port for the server
const PORT = process.env.PORT || 3001;

// Give the server a path to the public directory for static files
app.use(express.static(path.join(__dirname, 'public')));

// Set handlebars as the template engine for the server
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Have Express parse JSON and string data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// turn on routes
app.use(routes);

// turn on connection to database and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});