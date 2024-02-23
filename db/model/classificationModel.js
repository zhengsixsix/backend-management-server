const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var classificationSchema = new Schema({
  className: { type: String, required: true },
  classDesc: { type: String, required: true },
});

var Classification = mongoose.model("classifications", classificationSchema);

module.exports = Classification;
