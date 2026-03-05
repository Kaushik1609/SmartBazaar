import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: { // Price at the time of order
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        required: true
    },
    deliveryType: {
        type: String,
        enum: ['fast', 'standard'],
        required: true
    },
    distanceKm: {
        type: Number,
        default: 0
    },
    deliveryAddress: {
        type: String,
        default: ''
    },
    customerLocation: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number] // [longitude, latitude]
        }
    },
    estimatedDeliveryMinutes: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'packing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    statusHistory: [{
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' }
    }],
    feeBreakdown: {
        baseFee: { type: Number, default: 0 },
        distanceCharge: { type: Number, default: 0 },
        prioritySurcharge: { type: Number, default: 0 },
        bulkSurcharge: { type: Number, default: 0 },
        surgeMultiplier: { type: Number, default: 1 },
        discount: { type: Number, default: 0 },
        finalFee: { type: Number, default: 0 }
    }
}, { timestamps: true });

// Index for geospatial queries on customer location
orderSchema.index({ customerLocation: '2dsphere' });

const Order = mongoose.model('Order', orderSchema);
export default Order;
