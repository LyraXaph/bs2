const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const commentSchema = new Schema({
    text: {
        type: String, 
        required: 'Your comment must have text!'
    },  
    created: {
        type: Date, 
        dafault: Date.now
    }, 
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
        required: 'You must supply an author!'
    }, 
    boulder: {
        type: mongoose.Schema.ObjectId,
        ref: 'Boulder',
    }
});

function autopopulate(next){
    this.populate({ path: 'author', select: '-hash -salt' });
    next();
}

commentSchema.pre('find', autopopulate);
commentSchema.pre('findOne', autopopulate); 

module.exports = mongoose.model('Comment', commentSchema);
