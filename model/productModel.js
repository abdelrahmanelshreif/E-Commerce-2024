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
  totalRating: {
    type: Number,
    min: 1,
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
},
{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


productSchema.pre('save',(async function(next) {
  if (!this.isNew) return next();

  const lastProd = await this.constructor.findOne(
  {}, 
  {},
  { sort: { productID: -1}});
  if (lastProd) {
  this.productID= lastProd.productID + 1;
  } else {
  this.productID = 1;
  }
  next();
  })
  );

productSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
