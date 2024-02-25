const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var foodSchema = new Schema({
  name: { type: String, required: true }, // 名称
  price: { type: String, required: true }, // 价格
  desc: { type: String, required: true }, // 描述
  typeid: { type: String, required: false }, // 类别
  typeName: { type: String, required: false },
  isType: { type: Boolean, required: false },
  Specifications: { type: String, require: true },
  CargoSpace: { type: String, require: false },
  Inventory: { type: Number, require: false },
  ActualStocktakingQuantity: { type: Number, require: false },
  img: { type: String, required: true } // 图片
},
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } });

var Food = mongoose.model('foods', foodSchema);

module.exports = Food;