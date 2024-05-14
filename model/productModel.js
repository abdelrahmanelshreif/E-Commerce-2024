const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  sold: {
    type: Number,
    default: 0
  },
  images: {
    type: [String],
    default: []
  },
  subcategory: {
    type: [{
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      slug: String,
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    }],
    default: []
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    required: [true, "Please Enter Your Product Name"]
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, "Please Enter Your Product description"]
  },
  quantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, "Please Enter Your Product Price"]
  },
  imageCover: {
    type: String,
    required: true
  },
  category: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    name: String,
    slug: String,
    image: String
  },
  brand: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand'
    },
    name: String,
    slug: String,
    image: String
  },
  ratingsAverage: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


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
