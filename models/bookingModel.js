const mongoose = require(`mongoose`);

const schema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: `Tour`,
    require: [true, `Tour mandatory`]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: `User`,
    require: [true, `User mandatory`]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  price: {
    type: Number,
    require: [true, `Price mandatory`]
  },
  payed: {
    type: Boolean,
    default: true
  }
  /* tour user createdAt price payed */
});

schema.pre(/^find/, function(next) {
  this.populate({
    path: `tour`,
    select: `name summary`
  }).populate({
    path: `user`,
    select: `name email`
  });
  next();
});

module.exports = mongoose.model(`Booking`, schema);
