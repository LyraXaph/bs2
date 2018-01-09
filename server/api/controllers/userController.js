const mongoose = require('mongoose');
const User = require('./../models/User');
const promisify = require('es6-promisify');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().populate();
        return res.json(users);
    } catch(error) {
        console.log(error);
        return res.status(500).json({error});
    }
}

exports.validateRegister = (req, res, next) => {
    req.checkBody('email', 'That Email is not valid').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
    //req.checkBody('confirmPassword', 'Confirmed Password cannot be blank').notEmpty();
    //req.checkBody('confirmPassword', 'Your passwords do not match').equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
        res.status(400).send(errors);
        return; // stops the fn from running
    } else {
        next(); // there were no errors 
    }
};

exports.register = async (req, res, next) => {
    let user = await User.find({email: req.body.email});
    if (user.length < 1){
        try{
            const hash = await bcrypt.hashSync(req.body.password, 10);
            req.body.password = hash;
            req.body.gym = '59ece0c7dd8ba60590437e5c';
            try {
                user = await (new User(req.body)).save();
                return res.status(201).json({
                    user: user,
                    message: 'User created'
                });
            } catch (err) {
                return res.status(500).json({
                    message: err.message
                })
            }
        } catch (err){
            console.log(err);
            return res.status(500).json({
                message : err
            }); 
        }
    } else {
        return res.status(500).json({
            message: "User already exists"
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        let user = await User.findOne({email: req.body.email}).populate('gym', 'name');
        if (!user){
            return res.status(401).json({
                message: "Auth failed"
            });
        } 
        const result = await bcrypt.compare(req.body.password, user.password);
        if(result){
            const token = jwt.sign({
                email: user.email,
                id: user._id
            }, 
            process.env.JWT_SECRET
            // { expiresIn: "1h"}
            );
            return res.status(200).json({
                message: "Auth successful", 
                token: token,
                user: { 
                    email: user.email,
                    name: user.name,
                    lastname: user.lastname,
                    id: user._id,
                    gym: user.gym,
                    climbedBoulders: user.climbedBoulders
                }
            });
        } else {
            return res.status(500).json({message: "Auth failed"});
        }
    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Auth failed"});
    }
};

exports.autoSignIn = async (req, res) => {
    try {
        const user = await User.findById(req.userData.id).populate('gym', 'name');
        return res.status(200).json({
            user: { 
                email: user.email,
                name: user.name,
                lastname: user.lastname,
                id: user._id,
                gym: user.gym,
                climbedBoulders: user.climbedBoulders
            }
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Auth failed"});
    }
}

exports.getUserById = async (req, res) => {
    try { 
        const user = await User.findById(req.params.userId);
        return res.status(200).json({
            user: { 
                email: user.email,
                name: user.name, 
                lastname: user.lastname,
                gym: user.gym,
                climbedBoulders: user.climbedBoulders
            }
        });
    }  catch(err) {
        console.log(err);
        return res.status(500).send({message : err});
    }
}

exports.updateUser = async (req, res, next) => {
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: updateOps },
            { new: true, runValidators: true, context: 'query' }
        ).populate('gym', 'name');
        return res.status(200).json({
             message : 'User successfully updated!',
             user: user
            });
    } catch(err) {
        console.log(err);
        return res.status(500).send({message : err});
    }
   
}

exports.deleteUser = async(req, res) => {
    try{
       await User.findOneAndRemove({_id: req.params.id});
       return res.status(200).json( {message : 'User deleted!'});
    } catch(err) {
        console.log(err);
        return res.status(500).send(err);
    }
}
   
/* removes boulder from climbedBoulder if its there, otherwise add it to climbedBoulders */
exports.editClimbedBoulders = async(req, res) => {
    const user = await User.findOne({_id: req.params.userId});
    const climbedBoulders = user.climbedBoulders.map(obj => obj.toString())
    const operator = climbedBoulders.includes(req.params.boulderId) ? '$pull' : '$addToSet'
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId, 
            { [operator]: { climbedBoulders : req.params.boulderId}}, 
            { new: true }
        );
        return res.status(200).json({ message : 'Operation successful'});
    } catch(err) {
        console.log(err);
        return res.status(500).send({message : err});
    }
}