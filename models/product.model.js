const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

const enumType = {
  values: ["computer", "laptop", "mobile"],
  message: `Product type must be 'computer', 'laptop' or 'mobile'!`,
};

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
  },
  slugName: {
    type: String,
    slug: "name",
  },
  code: {
    type: String,
    default: "",
  },
  rating: {
    type: Number,
    default: 5,
  },
  price: {
    type: String,
    required: [true, "Price is required!"],
  },
  oldPrice: {
    type: String,
    slug: "price",
  },
  type: {
    // chua co
    type: String,
    default: "",
    // enum: enumType,
    // required: [true, "Type is required!"],
  },
  images: {
    type: Array,
    default: [],
  },
  quantity: {
    // type: String, // String or Number
    // required: [true, "Quantity is required!"],
    default: "",
  },
  tags: {
    type: Array,
    default: [],
  },
  producer: {
    type: String,
    required: [true, "Producer is required!"],
  },
  video: {
    type: String,
    default: "",
  },
  countView: {
    type: Number,
    default: 0,
  },
  countLike: {
    type: Number,
    default: 0,
  },
  countRating: {
    type: Number,
    default: 0,
  },
  countSale: {
    type: Number,
    default: 0,
  },
  details: {},
  descriptions: [
    {
      title: {
        type: String,
        default: "",
      },
      content: {
        type: String,
        default: "",
      },
      img: {
        type: String,
        default: "",
      },
    },
  ],
  comments: {
    type: Array,
    default: [],
  },
  promotion: {
    code: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
  },
  // } [
  //     {
  //         userId: {
  //             type: mongoose.Types.ObjectId,
  //             ref: 'User'
  //         },
  //         name: {
  //             type: String,
  //             default: 'Anonymous'
  //         },
  //         content: {
  //             type: String,
  //             default: 'No content'
  //         },
  //         rating: {
  //             type: Number,
  //             default: 5
  //         },
  //         date: {
  //             type: Date,
  //             default: new Date()
  //         },
  //     }
  // ]
});

// Add plugins
productSchema.set("timestamps", true);
mongoose.plugin(slug);

module.exports = mongoose.model("Product", productSchema);
