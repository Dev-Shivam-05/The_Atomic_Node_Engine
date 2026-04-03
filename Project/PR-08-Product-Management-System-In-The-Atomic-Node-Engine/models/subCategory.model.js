import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
    subcategoryName: {
        type: String,
        required: true,
    },
    subcategoryDescription: {
        type: String,
        required: true,
    },
    subcategoryImage: {
        type: String,
    },
}, {
    timestamps: true,
});

const subcategoryModel = mongoose.model('Subcategory', subcategorySchema);

export default subcategoryModel;