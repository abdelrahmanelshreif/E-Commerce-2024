const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  sold: {
    type: Number,
    required: true
  },
  imageCover: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory'
      //required: [true, 'A product must belong to at least one subcategory']
    }
  ],
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  ratingsAverage: {
    type: Number,
    required: true
  },
  ratingsQuantity: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date
    // required: true
  },
  updatedAt: {
    type: Date
    // required: true
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

productSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'category',
    select: 'name slug image'
  }).populate({
    path: 'brand',
    select: 'name slug image'
  });
  // .populate({
  //   path: 'subcategory',
  //   select: 'name slug category'
  // });
  next();
});
productSchema.post('save', async function(doc, next) {
  await doc
    .populate({
      path: 'category',
      select: 'name slug image'
    })
    .populate({
      path: 'brand',
      select: 'name slug image'
    })
    .execPopulate();
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
