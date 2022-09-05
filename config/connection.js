// Dependencies
// import the Sequelize constructor from the library
const Sequelize = require('sequelize');
// dotenv for local environmental variables for user name and password
require('dotenv').config();

// When the app is deployed, it will have access to Heroku's process.env.JAWSDB_URL variable and use that value to connect. Otherwise, it will continue using the localhost configuration.
const sequelize = process.env.JAWSDB_URL
? new Sequelize(process.env.JAWSDB_URL)
: new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
    });

module.exports = sequelize;