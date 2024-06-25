const express = require('express')
const router = express.Router()
const feedController = require('../controllers/feed')
const isAuth = require('../middleware/is-auth')
const { body } = require('express-validator')

router.get('/posts', isAuth, feedController.getPosts)
router.get('/post/:postId', isAuth, feedController.getPost)

router.put('/post/:postId', [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
], isAuth, feedController.editPost)

router.post('/post', [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
], isAuth, feedController.createPost)

router.delete('/post/:postId', isAuth, feedController.deletePost)

module.exports = router