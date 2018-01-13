const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const slug = require('slugs');

const boulderSchema = new Schema({
    name: {
        type: String, 
        required: "Please enter a boulder name."
    },
    slug: String,
    description: {
        type: String, 
    }, 
    grade: {
        type: String, // ??
        required: "Please enter a grade."
    },
    created: {
        type: Date, 
        dafault: Date.now
    }, 
    image: String, 
    creatorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
        required: 'You must supply an author!'
    }, 
    gym: {
        type: mongoose.Schema.ObjectId,
        ref: 'Gym', 
        dafault: '58c05fd08060197ca0b52d5a'
        //required: 'You must supply a gym!'
    }
}, 
    {
        toJSON: {virtuals: true}, 
        toObject: {vurtuals: true}
    }
);

//define indexes (index something as text)
boulderSchema.index({
    name: 'text',
    description: 'text',
    grade: 'text'
});

boulderSchema.pre('save', async function(next){
    if(!this.isModified('name')){
        next(); // skip it
        return; // stops this function from running
    }
    this.slug = slug(this.name);
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const bouldersWithSlug = await this.constructor.find({ slug: slugRegEx});
    if (bouldersWithSlug.length){
        this.slug = `${this.slug}-${bouldersWithSlug.length + 1}`;
    }
    next();
});

 // find reviews where the boulder.id property === reviews boulder property
boulderSchema.virtual('reviews', {
    ref: 'Review', 
    localField: '_id', // which field on the boulder model
    foreignField: 'boulder' // which field on the review model 
});

boulderSchema.virtual(
    'comments', {
        ref: 'Comment', 
        localField: '_id', 
        foreignField: 'boulder' 
    }
); 

function autopopulate(next){
    this.populate({ path: 'comments', select: '-hash -salt -_id' });
    next();
}

boulderSchema.pre('find', autopopulate);
boulderSchema.pre('findOne', autopopulate); 


module.exports = mongoose.model('Boulder', boulderSchema);
