import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'vendor', 'delivery'],
        default: 'customer'
    },
    shopName: {
        type: String
    },
    shopDescription: {
        type: String
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number] // [longitude, latitude]
        }
    },
    address: {
        type: String
    }
}, { timestamps: true });

// Index for geospatial queries
userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);
export default User;
