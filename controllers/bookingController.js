const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const factory = require(`./handlerFactory`);
const Booking = require(`../models/bookingModel`);
const Tour = require(`../models/tourModel`);
const catchAsync = require(`../utils/catchAsync`);
const ErrorApp = require(`../utils/appError`);

exports.getAllBookings = factory.getAll(Booking);
exports.getOneBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

exports.getSessionCheckout = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        name: `${tour.name} tour`,
        description: tour.summary,
        images: [tour.imageCover],
        amount: tour.price * 100,
        currency: "eur",
        quantity: 1
      }
    ],
    success_url: `${req.protocol}://${req.get(
      `host`
    )}/api/v1/bookings/create-from-session?price=${tour.price}&user=${
      req.user._id
    }&tour=${tour._id}`,
    cancel_url: `${req.protocol}://${req.get(`host`)}/tour/${tour.slug}`,
    customer_email: req.user.email
  });

  res.status(200).json({
    status: `success`,
    session
  });
});

exports.createFromSession = catchAsync(async (req, res, next) => {
  const { price, user, tour } = req.query;
  if (price && user && tour) {
    const newBooking = await Booking.create({ price, tour, user });
  }
  res.status(200).redirect("/");
});
