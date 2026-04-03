import mongoose from 'mongoose';

const extraCategorySchema = new mongoose.Schema({
    extraCategoryName: {
        type: String,
        required: true,
    },
    extraCategoryDescription: {
        type: String,
        required: true,
    },
    extraCategoryImage: {
        type: String,
    },
},{
    timestamps: true,
});

const extraCategoryModel = mongoose.model('extraCategory', extraCategorySchema);

export default extraCategoryModel;