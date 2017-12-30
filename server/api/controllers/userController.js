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
    //req.sanitizeBody('name');

    //req.checkBody('name', 'You must supply a name!').notEmpty();
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
            user = await (new User(req.body)).save();
            return res.status(201).json({
                user: user,
                message: 'User created'
            });
        } catch (err){
            console.log(err);
            return res.status(500).json({
                error : err
            }); 
        }
    } else {
        return res.status(500).json({
            error: "User already exists"
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        let user = await User.findOne({email: req.body.email});
        if (user.length < 1){
            return res.status(401).json({
                message: "Auth failed"
            });
        } 
        const result = await bcrypt.compare(req.body.password, user.password);
        console.log(req.body.password);
        console.log(user.password)
        if(result){
            const token = jwt.sign({
                email: user.email,
                id: user._id,
                gym: user.gym
            }, 
            process.env.JWT_SECRET,
            { expiresIn: "1h"}
            );
            return res.status(200).json({
                message: "Auth successful", 
                token: token
            });
        } else {
            return res.status(500).json({message: "Auth sadafailed"});
        }
    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Auth failed"});
    }
};

exports.updateAccount = async (req, res) => {
    const updates = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: updates },
        { new: true, runValidators: true, context: 'query' }
    );
    req.flash('success', 'Updated the profile');
    res.redirect('back'); //back to the one they came from 
}

exports.deleteUser = async(req, res) => {
    try{
       await User.findOneAndRemove({_id: req.params.id});
    } catch(err) {
        console.log(err);
        return res.status(500).send(err);
    }
    return res.status(200).json( {message : 'User deleted!'});
}