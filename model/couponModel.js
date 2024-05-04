const mongoose = require('mongoose');
// Code: The unique code for the coupon.
// DiscountType: The type of discount, which can be either 'percentage' or 'fixed'.
// DiscountAmount: The amount or percentage of the discount.
// MinimumPurchaseAmount: The minimum purchase amount required to apply the coupon.
// ValidFrom: The date from which the coupon becomes valid.
// ValidUntil: The date until which the coupon remains valid.
// MaxRedemptions: The maximum number of times the coupon can be redeemed (optional, defaults to Infinity).
// CurrentRedemptions: The current number of times the coupon has been redeemed (optional, defaults to 0).
// CreatedAt: The timestamp of when the coupon was created.
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountAmount: {
        type: Number,
        required: true
    },
    minimumPurchaseAmount: {
        type: Number,
        default: 0
    },
    validFrom: {
        type: Date,
        required: true
    },
    validUntil: {
        type: Date,
        required: true
    },
    maxRedemptions: {
        type: Number,
        default: Infinity
    },
    currentRedemptions: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;