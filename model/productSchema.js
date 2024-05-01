// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     category: {
//         type: String,
//         required: true
//     },
//     productName: {
//         type: String,
//         required: true
//     },
//     productDescription: {
//         type: String,
//         required: true
//     },
//     quantity: {
//         type: Number,
//         required: true
//     },
//     productId: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     productOriginalPrice: {
//         type: Number,
//         required: true
//     },
//     productCurrentPrice: {
//         type: Number,
//         required: true
//     },
//     rating: {
//         type: Number,
//         default: 0
//     },
//     reviews: [{
//         type: String
//     }],
//     size: {
//         type: String
//     },
//     color: {
//         type: String
//     },
//     arrayOfProductPhotos: [{
//         type: String
//     }],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// const Product = mongoose.model('Product', productSchema);

// productSchema.pre('save', function(next) {
//   const product = this;
//   if (!product.productId) {
//       // Generate a unique productId using shortid
//       product.productId = shortid.generate();
//   }
//   next();
// });


// module.exports = Product;
