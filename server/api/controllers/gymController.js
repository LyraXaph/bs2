const Gym = require('./../models/Gym');

exports.getGyms =  async (req, res) => {
    let gyms = null
    if (req.query.search) {
        let regex = new RegExp('.*' + req.query.search + '.*', 'gi');        
        gyms = await Gym.
            // first find Problems that match
            find({
                "name": regex
            }, {
                score: { $meta: 'textScore' }
            })
            // then sort them 
            .sort({
                score: { $meta: 'textScore' }
            })
            // limit to only 5 results
            .limit(5);  
    } else {
    //1. query the database for the list of all stores
        gyms = await Gym.find();
    }
    return res.status(200).json(gyms);
}

exports.createGym = async (req, res, next) => {
    res.status(200).json({
        message: `you created a new gym with id ${req.params.gymId}`
    })
}

exports.getGym = async (req, res, next) => {
    try {
        const gym = await Gym.findById(req.params.gymId);
        res.status(200).json(gym);
    }  catch(err) {
        console.log(err);
        return res.status(500).send({message : err});
    }
}

exports.updateGym = (req, res, next) => {
    res.status(200).json({
        message: `you updated gym with id ${req.params.gymId}`
    })
}

exports.deleteGym = (req, res, next) => {
    res.status(200).json({
        message: `you deleted gym with id ${req.params.gymId}`
    })
}