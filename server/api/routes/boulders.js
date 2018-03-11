const express = require('express');
const router = express.Router();
const BoulderController = require('./../controllers/boulderController');
const checkAuth =require('./../middleware/check-auth');

router.get('/', BoulderController.getBoulders);

router.get('/:boulderId', BoulderController.getBoulder);

router.post('/', 
    checkAuth,
    BoulderController.upload, 
    BoulderController.resize, 
    BoulderController.createBoulder);

router.get('/:slug', BoulderController.getBoulderBySlug);

router.patch('/:boulderId', BoulderController.updateBoulder);

router.delete('/:boulderId', BoulderController.deleteBoulder);

router.get('/getAvgRating/:boulderId', BoulderController.getBoulderAvgRating)

module.exports = router;