const Review = require('./../models/Review');
const Boulder = require('./../models/Boulder');

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
    try {
        const review = await Review.findOne({
            author: req.body.author,
            boulder: req.body.boulder
        });
        let newAvgRating;
        if (!review){
            const newReview = await (new Review(req.body)).save();
            newAvgRating = (await Boulder.getAvgRating(req.body.boulder))[0].averageRating;
            res.status(200).json({
                success: true,
                message: "Review successfully added!",
                reviewId: newReview._id,
                review: newReview,
                newAvgRating: newAvgRating
            });
        } else {
            const updatedReview = await Review.findByIdAndUpdate(
                review._id,
                { $set: {rating : req.body.rating} },
                { new: true, runValidators: true, context: 'query' }
            );
            newAvgRating = (await Boulder.getAvgRating(req.body.boulder))[0].averageRating;
            res.status(200).json({
                success: true,
                message: "Review successfully updated!",
                reviewId: updatedReview._id,
                review: updatedReview, 
                newAvgRating: newAvgRating
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({success: false, message: err});
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

exports.deleteReviews = async (req, res, next) => {
    try {
        await Review.remove({});
        return res.status(200).json({
            message: `All reviews successfully deleted!`
        })
     }  catch(err) {
        console.log(err);
        return res.status(500).send({message : err});
    }
}