import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    productDescription: {
        type: String,
        required: true,
    },
    productQuantity: {
        type: Number,
        required: true,
    },
    Image: {
        type: String,
    },
    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    productSubcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true,
    },
    productExtraCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExtraCategory',
        required: true,
    },
},{
    timestamps: true,
});

const productModel = mongoose.model('Product', productSchema);

export default productModel;