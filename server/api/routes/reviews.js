const express = require('express');
const router = express.Router();
const ReviewController = require('./../controllers/reviewController');

router.get('/', ReviewController.getReviews);

router.post('/', ReviewController.addReview);

router.get('/:reviewId', ReviewController.getReview);

router.patch('/:reviewId', ReviewController.updateReview);

router.delete('/:reviewId', ReviewController.deleteReview);

router.delete('/', ReviewController.deleteReviews);

module.exports = router;