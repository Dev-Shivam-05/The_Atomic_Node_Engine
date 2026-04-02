import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
    subcategoryName: {
        type: String,
        required: true,
    },
    Image: {
        type: String,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }
}, {
    timestamps: true,
});

const subcategoryModel = mongoose.model('Subcategory', subcategorySchema);

export default subcategoryModel;