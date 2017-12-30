const express = require('express');
const router = express.Router();
const BoulderController = require('./../controllers/boulderController');

router.get('/', BoulderController.getBoulders);

router.post('/', BoulderController.upload, BoulderController.resize, BoulderController.createBoulder);

router.get('/:slug', BoulderController.getBoulderBySlug);

router.patch('/:boulderId', BoulderController.updateBoulder);

router.delete('/:boulderId', BoulderController.deleteBoulder);

module.exports = router;