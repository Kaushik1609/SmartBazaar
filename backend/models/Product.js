import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    weight: {
        type: String,
    },
    imageUrl: {
        type: String
    }
}, { timestamps: true });

// Create indexes for optimizing search
productSchema.index({ vendor: 1 });
productSchema.index({ category: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
