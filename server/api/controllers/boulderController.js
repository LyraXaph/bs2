const mongoose = require('mongoose');
const Boulder = require('./../models/Boulder');
const multer = require('multer');
const uuid = require('uuid');
const jimp = require('jimp');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next){
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto) {
            next(null, true);
        } else {
            next( {message: 'That filetype isn\'t allowed'}, false);
        }
    }
};

exports.upload = multer(multerOptions).single('image');

exports.resize = async (req, res, next) => {
    // check if there is no new file to resize
    if (!req.file){
        next(); // skip to the next middleware
        return;
    } 
    const extension = req.file.mimetype.split('/')[1];
    req.body.image = `${uuid.v4()}.${extension}`; 
    // now we resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.image}`);
    next();
}

exports.getBoulder =  async (req, res) => {
    try {
    const boulder = await Boulder.findById(req.params.boulderId).populate('reviews comments');
    res.status(200).json(boulder);
    } catch (err) {
        console.log(err);
        res.json({success: false, message: err});
    }
}

exports.getBoulders =  async (req, res) => {
    let boulders = null
    if (req.query.search) {
        let regex = new RegExp('.*' + req.query.search + '.*', 'gi');        
        boulders = await Boulder.
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
    try {
        boulders = await Boulder.find();
    }catch (err) {
        console.log(err);
        res.json({success: false, message: err});
    }

    }
    res.status(200).json(boulders);
}

exports.createBoulder = async (req, res, next) => {
    try{
        const boulder = await (new Boulder(req.body)).save();
        res.status(200).json({
            success: true,
            message: "Boulder successfully added!",
            boulderId: boulder._id, 
            boulderImage: boulder.image
        });
    }
    catch (err) {
        console.log(err);
        res.json({success: false, message: err});
    }
}

exports.getBoulderBySlug = async (req, res, next) => {
    try{
        const boulder = await Boulder.findOne({slug : req.params.slug}).populate('author reviews');
        return res.status(200).send(boulder);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: err});
    }
}

exports.updateBoulder = async (req, res, next) => {
    console.log(req.params)
    console.log(`updating boulder with id: ${req.params.boulderId}`);
    try {
        const boulder = await Boulder.findOneAndUpdate(
            {_id: req.params.boulderId},
            req.body,
            {new: true, // return the updated Boulder instead of the old one
            runValidators: true}
        );
        return res.status(200).send(boulder);
    }  catch(err) {
        console.log(err);
        return res.status(500).send({message : err});
    }
}

exports.deleteBoulder = async (req, res, next) => {
    try {
        await Boulder.findOneAndRemove({_id: req.params.boulderId});
        return res.status(200).json({
            message: `you deleted boulder with id ${req.params.boulderId}`
        })
     }  catch(err) {
        console.log(err);
        return res.status(500).send({message : err});
    }
}