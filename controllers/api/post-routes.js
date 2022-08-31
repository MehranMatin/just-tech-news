const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Vote, Comment } = require('../../models');

// GET api/posts/ -- get all posts
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
        // Query configuration
        // From the Post table, include the post ID, URL, title, and the timestamp from post creation, as well as total votes
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
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
        // return the posts
        .then(dbPostData => res.json(dbPostData))
        // if there was a server error, return the error
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET api/posts/:id -- get a single post by id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            // specify the post id parameter in the query
            id: req.params.id
        },
        // Query configuration, as with the get all posts route
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
                attributes: ['id', 'comment_text', 'created_at'],
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
            // if no post by that id exists, return an error
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            // if a server error occured, return an error
            console.log(err);
            res.status(500).json(err);
        });
});

// POST api/posts -- create a new post
router.post('/', (req, res) => {
    // expects object of the form {title: 'Sample Title Here', post_url: 'http://somestring.someotherstring', user_id: 1}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// PUT api/posts/upvote -- upvote a post (this route must be above the update route, otherwise express.js will treat upvote as an id)
router.put('/upvote', (req, res) => {
    // custom static method created in models/Post.js
    Post.upvote(req.body, { Vote })
        .then(updatedVoteData => res.json(updatedVoteData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// PUT api/posts/1-- update a post's title
router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// delete a post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// expose this router
module.exports = router;