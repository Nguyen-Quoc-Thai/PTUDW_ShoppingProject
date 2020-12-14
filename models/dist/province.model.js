const mongoose = require("mongoose");

const provinceSchema = mongoose.Schema({
  name: {
    type: String,
  },
  slug: {
    type: String,
  },
  type: {
    type: String,
  },
  name_with_type: {
    type: String,
  },
  code: {
    type: String,
  },
});

// Add plugins
provinceSchema.set("timestamps", true);

module.exports = mongoose.model("Province", provinceSchema);
