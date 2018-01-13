const Review = require('./../models/Review');

exports.getReviews =  async (req, res) => {
    let reviews = null
    try {
        reviews = await Review.find();
        return res.status(200).json(reviews);
    }
    catch (err) {
        console.log(err);
        res.json({success: false, message: err});
    }
}

exports.addReview = async (req, res, next) => {
    try{
        const review = await (new Review(req.body)).save();
        res.status(200).json({
            success: true,
            message: "Review successfully added!",
            reviewId: review._id,
            review: review
        });
    }
    catch (err) {
        console.log(err);
        res.json({success: false, message: err});
    }
}

exports.getReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        res.status(200).json(review);
    }  catch(err) {
        console.log(err);
        return res.status(500).send({message : err});
    }
}

exports.updateReview = async (req, res, next) => {
    res.status(200).json({
        message: `you updated review with id ${req.params.reviewId}`
    })
}

exports.deleteReview = async (req, res, next) => {
    try {
        await Review.findOneAndRemove({_id: req.params.reviewId});
        return res.status(200).json({
            message: `Review with id ${req.params.reviewId} successfully deleted!`
        })
     }  catch(err) {
        console.log(err);
        return res.status(500).send({message : err});
    }
}