const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: String,
    sale: {
      type: Number,
      required: [true, "You must specify sale percentage!"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    validDays: {
      type: Number,
      required: [true, "You must specify valid Days!"],
    },
    expiryDate: Date,
    createdAt: Date,
  },
  /*scema options*/ { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
couponSchema.pre("save", function(next) {
  this.expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000 * this.validDays);
  this.createdAt = Date.now();
  next();
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
