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

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    // check if there is no new file to resize
    if (!req.file){
        next(); // skip to the next middleware
        return;
    } 
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`; 
    // now we resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
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
    //1. query the database for the list of all stores
    boulders = await Boulder.find();
    }
    res.status(200).json(boulders);
}

exports.createBoulder = async (req, res, next) => {
    //console.log(req.file);
    try{
        const boulder = await (new Boulder(req.body)).save();
        res.status(200).json({success: true, message: "Boulder successfully added!"});
    }
    catch (err) {
        console.log(err);
        res.json({success: false, message: err});
    }
}

exports.getBoulder = (req, res, next) => {
    res.status(200).json({
        message: `you discovered boulder with id ${req.params.boulderId}`
    });
}

exports.getBoulderBySlug = async (req, res, next) => {
    try{
        const boulder = await Boulder.findOne({slug : req.params.slug}).populate('author reviews');
        res.status(200).send(boulder);
    } catch (err) {
        console.log(err);
        res.status(500).json({error:err});
    }
}

exports.updateBoulder = async (req, res, next) => {
    console.log(`updating boulder with id: ${req.params.boulderId}`);
    try {
        const boulder = await Boulder.findOneAndUpdate(
            {_id: req.params.boulderId},
            req.body,
            {new: true, // return the updated Boulder instead of the old one
            runValidators: true}
        );
        res.status(200).send(boulder);
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.deleteBoulder = async (req, res, next) => {
    res.status(200).json({
        message: `you deleted boulder with id ${req.params.boulderId}`
    })
}