const mongoose = require("mongoose");

const enumStatus = {
  values: ["waiting", "confirmed", "transferring", "delivered", "canceled"],
  message: `Trạng thái phải là 'waiting', 'confirmed', 'transferring', 'delivered' or 'canceled'!`,
};

const enumPaymentMethod = {
  values: ["cod", "paypal", "banking"],
  message: `Phương thức thanh toán phải là 'cod', 'paypal' or 'banking'!`,
};

const checkoutSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  cartId: {
    type: mongoose.Types.ObjectId,
    ref: "Cart",
  },
  status: {
    type: String,
    enum: enumStatus,
    default: "waiting",
  },
  receiver: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  district: {
    type: String,
    default: "",
  },
  village: {
    type: String,
    default: "",
  },
  paymentMethod: {
    type: String,
    enum: enumPaymentMethod,
    default: "cod",
  },
  items: {
    type: Array,
    default: [],
  },
  totalQuantity: {
    type: Number,
    default: 0,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  shippingFee: {
    type: Number,
    default: 3,
  },
  totalPayment: {
    type: Number,
    required: [true, "Tổng tiền phải trả là bắt buộc!"],
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

// Add plugins
checkoutSchema.set("timestamps", true);

module.exports = mongoose.model("Checkout", checkoutSchema);
