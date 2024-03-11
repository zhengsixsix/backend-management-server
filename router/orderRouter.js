const express = require("express");
const router = express.Router();
const Order = require("../db/model/orderModel");
const { formatDateTime } = require("../utils/time");
const Food = require("../db/model/foodModel");

router.post("/add", (req, res) => {
  const {
    orderNo,
    name,
    productNum,
    customer,
    productAmount,
    productType,
    PaymentMethod,
    DistributionMode,
    PlaceOrder,
  } = req.body;
  Order.find({ orderNo }).then((data) => {
    if (data.length === 0) {
      Order.insertMany({
        orderNo,
        name,
        productNum,
        customer,
        productAmount,
        productType,
        PaymentMethod,
        DistributionMode,
        PlaceOrder,
      })
        .then(() => {
          res.send({ code: 200, msg: "添加成功" });
        })
        .catch(() => {
          res.send({ code: 500, msg: "添加失败" });
        });
    } else {
      res.send({ code: 500, msg: "订单已存在" });
    }
  });
});

router.post("/update", (req, res) => {
  const {
    _id,
    orderNo,
    name,
    productNum,
    customer,
    productAmount,
    productType,
    PaymentMethod,
    DistributionMode,
    PlaceOrder,
  } = req.body;
  Order.updateOne(
    { _id },
    {
      orderNo,
      name,
      productNum,
      customer,
      productAmount,
      productType,
      PaymentMethod,
      DistributionMode,
      PlaceOrder,
    }
  )
    .then(() => {
      res.send({ code: 200, msg: "编辑成功" });
    })
    .catch(() => {
      res.send({ code: 500, msg: "编辑失败" });
    });
});

router.delete("/delete", (req, res) => {
  let { _id } = req.body;
  Order.deleteOne({ _id })
    .then((data) => {
      res.send({ code: 200, msg: "删除成功" });
    })
    .catch(() => {
      res.send({ code: 500, msg: "删除失败" });
    });
});

router.post("/getAllFoods", (req, res) => {
  const { name } = req.body;
  const reg = new RegExp(name);
  let query = { $or: [{ name: { $regex: reg } }] };
  Food.find(query).then((data) => {
    let result = data.map((item) => {
      return {
        label: item.name,
        value: item.name,
      };
    });
    res.send({
      code: 200,
      data: result,
    });
  });
});

router.post("/changeOrderType", (req, res) => {
  const { _id, productType } = req.body;
  Order.updateOne({ _id }, { productType })
    .then(() => {
      res.send({ code: 200, msg: "修改成功" });
    })
    .catch(() => {
      res.send({ code: 500, msg: "修改失败" });
    });
});

router.post("/page", (req, res) => {
  const pageNo = Number(req.body.pageNo) || 1;
  const pageSize = Number(req.body.pageSize) || 10;
  const { orderNo, PaymentMethod, productType, startDate, endDate } = req.body;
  let query = {
    orderNo: { $regex: orderNo },
    PaymentMethod: { $regex: PaymentMethod },
  };
  if (typeof productType === "boolean") {
    query["productType"] = productType;
  }
  Order.countDocuments(query, (err, count) => {
    if (err) {
      res.send({ code: 500, msg: "订单列表获取失败" });
      return;
    }
    Order.aggregate(
      [
        {
          $match: query,
        },
        {
          $lookup: {
            // 多表联查  通过roleId获取foodtypes表数据
            from: "foods", // 需要关联的表roles
            localField: "name", // foods表需要关联的键
            foreignField: "name", // foodtypes表需要关联的键
            as: "foods", // 对应的外键集合的数据，是个数组 例如： "roles": [{ "roleName": "超级管理员"}]
          },
        },
        {
          $skip: pageSize * (pageNo - 1),
        },
        {
          $limit: pageSize,
        },
        {
          // $project中的字段值 为1表示筛选该字段，为0表示过滤该字段
          $project: { foodtypes: { createTime: 0, typeid: 0, __v: 0, _id: 0 } },
        },
      ],
      function (err, docs) {
        if (err) {
          res.send({ code: 500, msg: "订单列表获取失败" });
          return;
        }
        res.send({
          code: 200,
          data: docs,
          total: count,
          pageNo: pageNo,
          pageSize: pageSize,
        });
      }
    );
  });
});
module.exports = router;
