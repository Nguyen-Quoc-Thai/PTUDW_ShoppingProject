const Checkout = require("../../../models/checkout.model");

// AJAX
module.exports.getCheckoutHistory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const checkout = await Checkout.findById(id);

    res.status(200).json({
      msg: "success",
      data: checkout,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: error.message,
      error,
    });
  }
};

// AJAX
// module.exports.patchUpdate = async (req, res, next) => {
//   const checkoutStatus = [
//     "waiting",
//     "confirmed",
//     "transferring",
//     "delivered",
//     "canceled",
//   ];
//   const { checkoutId } = req.params;
//   const { status } = req.body;

//   try {
//     if (!checkoutStatus.includes(status))
//       throw new Error(
//         `Invalid status! Status must be 'waiting', 'confirmed', 'transferring', 'delivered' or 'canceled'! `
//       );

//     const checkout = await Checkout.findById(checkoutId);
//     if (!checkout) throw new Error("Cart checkout not found!");
//     checkout.status = status;
//     await checkout.save();

//     res.status(200).json({
//       msg: "success",
//       user: "Update status successful!",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(205).json({
//       msg: "ValidatorError",
//       user: error.message,
//     });
//   }
// };
