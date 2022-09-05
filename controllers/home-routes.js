// User facing routes from handlebars
//Dependencies
// Router
const router = require('express').Router();
// Sequelize and the Post, User, and Comment Models
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// Route to get the homepage and render all the posts
router.get('/', (req, res) => {
    // console.log(req.session);
    // get the posts from the database
    console.log('======================');
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            // create an array for the posts, using the get method to trim extra sequelize object data out
            const posts = dbPostData.map(post => post.get({ plain: true }));
            // pass the posts into the homepage template
            res.render('homepage', { posts });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Route to render the login page
router.get('/login', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    
    res.render('login');
});

module.exports = router;