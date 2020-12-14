const mongoose = require("mongoose");

const { randomPassword } = require("./../utils/passport");

const enumUser = {
  values: ["user", "admin"],
  message: `Roles must be 'user' or 'admin'!`,
};

const enumStatus = {
  values: ["active", "disable"],
  message: `Status must be 'active' or 'disable'!`,
};

const userScheme = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required!"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required!"],
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid email!",
    ],
  },
  phone: {
    type: String,
    // required: [true, "Phone number is required!"],
    default: "0987654321",
    // unique: true,
    match: [/(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, "Invalid phone number!"],
  },
  roles: {
    type: String,
    enum: enumUser,
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: enumStatus,
    default: "active",
  },
  cash: {
    type: Number,
    default: 0,
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
  avatar: {
    type: String,
    default: "",
  },
  likes: {
    type: Array,
    default: [],
  },
  password: {
    type: String,
    // required: [true, "Password is required!"],
    default: randomPassword(8),
  },
  passwordResetToken: {
    type: String,
    default: randomPassword(10),
  },
  passwordResetExpires: {
    type: Date,
    default: Date.now(),
  },
  slugName: {
    type: String,
  },
  cloudinary_id: {
    type: String,
    default: "",
  },
  google: {
    type: Object,
    default: {
      id: "",
      token: "",
    },
  },
  facebook: {
    type: Object,
    default: {
      id: "",
      token: "",
    },
  },
});

// userScheme.path("phone").validate(async (value) => {
//   const phoneCount = await mongoose.models.User.countDocuments({
//     phone: value,
//   });
//   return !phoneCount;
// }, "Phone number is already exists!");

userScheme.path("email").validate(async (value) => {
  const emailCount = await mongoose.models.User.countDocuments({
    email: value,
  });
  return !emailCount;
}, "Email is already exists!");

// Add plugins
userScheme.set("timestamps", true);
module.exports = mongoose.model("User", userScheme);
