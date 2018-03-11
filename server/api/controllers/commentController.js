const Comment = require('./../models/Comment');

exports.getComments =  async (req, res) => {
    try {
        const comments = await Comment.find();
        return res.status(200).json(comments);
    }
    catch (err) {
        console.log(err);
        res.json({success: false, message: err});
    }
}

exports.addComment = async (req, res, next) => {
    try{
        const comment = await (new Comment(req.body)).save();
        res.status(200).json({
            success: true,
            message: "Comment successfully added!",
            commentId: comment._id,
            comment: comment
        });
    }
    catch (err) {
        console.log(err);
        res.json({success: false, message: err});
    }
}

exports.getComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId).populate('author', '-_id -salt -hash');
        res.status(200).json(comment);
    }  catch(err) {
        console.log(err);
        return res.status(500).send({message : err});
    }
}

exports.deleteComment = async (req, res, next) => {
    try {
        await Comment.findOneAndRemove({_id: req.params.commentId});
        return res.status(200).json({
            message: `Comment with id ${req.params.commentId} successfully deleted!`
        })
     }  catch(err) {
        console.log(err);
        return res.status(500).send({message : err});
    }
}