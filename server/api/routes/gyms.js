const express = require('express');
const router = express.Router();
const GymController = require('./../controllers/gymController');

router.get('/', GymController.getGyms);

router.post('/', GymController.createGym);

router.get('/:gymId', GymController.getGym);

router.patch('/:gymId', GymController.updateGym);

router.delete('/:gymId', GymController.deleteGym);

module.exports = router;