import mongoose from 'mongoose';

const extraCategorySchema = new mongoose.Schema({
    extraCategoryName: {
        type: String,
        required: true,
    },
    Image: {
        type: String,
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true,
    }
}, {
    timestamps: true,
});

const extraCategoryModel = mongoose.model('extraCategory', extraCategorySchema);

export default extraCategoryModel;