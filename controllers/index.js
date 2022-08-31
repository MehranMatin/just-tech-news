const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');

// Define paths for the handlebars html routes
router.use('/', homeRoutes);

// Define the path for the server for the API routes
router.use('/api', apiRoutes);

// Define a catch-all route for any resource that doesn't exist
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;