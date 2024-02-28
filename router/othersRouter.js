const express = require("express");
const router = express.Router();
const Food = require("../db/model/foodModel");
const Order = require('../db/model/orderModel')
const { formatDateTime } = require("../utils/time");

router.get("/getInventory", (req, res) => {
  Food.find({}).then((data) => {
    let xData = [];
    let YData = [];
    data.forEach((item) => {
      xData.push(item.name);
      YData.push(item.Inventory);
    });
    res.send({ code: 200, data: { xData, YData }, msg: "查询成功" });
  });
});
router.get("/getClass", (req, res) => {
  Food.find({}).then((data) => {
    var xData = [];
    var YData = [];
    data.forEach((item) => {
      if (item.isType == false) {
        Food.countDocuments({ isType: false }, (err, count) => {
          if (xData.indexOf("未分类") === -1) {
            xData.push("未分类");
            YData.push(count);
          }
        });
      } else {
        Food.countDocuments({ typeid: item.typeid }, (err, count) => {
          xData.push(item.typeName);
          YData.push(count);
        });
      }
    });
    setTimeout(() => {
      res.send({ code: 200, data: { xData, YData }, msg: "查询成功" });
    }, 200);
  });
});
router.get("/getOrder", (req, res) => {
  Order.find({}).then((data) => {
    var xData = [];
    var YData = [];
    xData = data.map(item => item.name)
    YData = data.map(item => item.productNum)
    res.send({ code: 200, data: { xData, YData }, msg: "查询成功" });
  });
});
module.exports = router;
