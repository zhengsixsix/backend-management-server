const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var orderSchema = new Schema(
  {
    orderNo: { type: String, required: true }, // 订单号
    name: { type: String, required: true }, // 商品名称
    productNum: { type: Number, required: true }, // 商品个数
    customer: { type: String, required: false }, // 收货客户
    productAmount: { type: Number, required: true }, // 订单金额
    productType: { type: Boolean, required: true }, // 订单状态
    PaymentMethod: { type: String, required: false }, // 支付方式
    DistributionMode: { type: String, required: false }, // 配送方式
    PlaceOrder: { type: String, required: true }, // 下单时间
    food: { type: Schema.Types.ObjectId, ref: 'foods' },
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);
var Order = mongoose.model("orders", orderSchema);
module.exports = Order;
