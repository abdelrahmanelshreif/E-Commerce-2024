const mongoose = require("mongoose");

//REVIEW; ??

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Product Name"],
  },
  productID: {
    type: String,
    default: null,
    // unique: true,
  },
  category: {
    type: String,
    unique: true,
    required: [true, "Please Enter Your Product Category"],
  },
  description: {
    type: String,
    required: [true, "Please Enter Your Product description"],
  },
  stock: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  originalPrice: {
    type: Number,
    required: [true, "Please Enter Your Product Price"],
  },
  currentPrice: {
    type: Number,
    default: function() {
      return this.originalPrice;
    },
  },
  size: {
    type: String,
    default: "One Size",
  },
  color: [{ type: String, default: null }],
  productPhotos: [{ type: String, default: null }],
  createdAt: { type: Date, default: Date.now() },
  active: {
    type: Boolean,
    select: false,
    default: true,
  },
});

productSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
