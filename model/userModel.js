const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    userId: {
      type: Number,
      unique: true
    },
    photo: String,
    email: {
      type: String,
      required: [true, 'Please Enter Your Email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Plase Provide a Valid Email']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please Enter Your Mobile Phone Number']
    },
    address: {
      region: {
        type: String,
        enum: ['Cairo', 'Governerates']
      },
      governrate: String,
      city: String,
      street: String,
      area: String,
      building: Number,
      floor: Number,
      Appartment: Number
    },
    verificationCode: Number,
    role: {
      type: String,
      enum: ['user', 'admin', 'merchant'],
      default: 'user',
      required: true
    },
    password: {
      type: String,
      required: [true, 'Please Provide Your Password'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please Confirm Your Password'],
      validate: [
        {
          validator: function(el) {
            return el === this.password;
          },
          message: 'Password not the same'
        }
      ]
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now() - 1
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      select: false,
      default: true
    },
    updatedAt: Date
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre('save', async function(next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  //hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //delete password Confirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre('save', async function(next) {
  if (!this.isNew) return next();

  try {
    const lastUser = await this.constructor.findOne(
      {},
      {},
      { sort: { userId: -1 } }
    );
    if (lastUser) {
      this.userId = lastUser.userId + 1;
    } else {
      this.userId = 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre(/^find/, function(next) {
  // this points to current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (!this.passwordChnagedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp; //300 < 200
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  // this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
