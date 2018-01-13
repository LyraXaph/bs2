const express = require('express');
const router = express.Router();
const CommentController = require('./../controllers/commentController');

router.get('/', CommentController.getComments);

router.post('/', CommentController.addComment);

router.get('/:commentId', CommentController.getComment);

// router.patch('/:reviewId', ReviewController.updateReview);

router.delete('/:commentId', CommentController.deleteComment);

module.exports = router;