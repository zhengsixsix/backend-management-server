const express = require("express");
const router = express.Router();
const Order = require("../db/model/orderModel");
const { formatDateTime } = require("../utils/time");
const Food = require("../db/model/foodModel");

/**
 * @api {post} /food/add 商品添加
 * @apiName 商品添加
 * @apiGroup Food
 *
 * @apiParam {String} name 名称
 * @apiParam {String} price 价格
 * @apiParam {String} desc 描述
 * @apiParam {Number} typeid 分类id
 * @apiParam {String} img 图片
 */
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
  Order.find({ name })
    .then((data) => {
      if (data.length === 0) {
        return Order.insertMany({
          orderNo,
          name,
          productNum,
          customer,
          productAmount,
          productType,
          PaymentMethod,
          DistributionMode,
          PlaceOrder,
        });
      } else {
        res.send({ code: 500, msg: "订单已存在" });
      }
    })
    .then(() => {
      res.send({ code: 200, msg: "添加成功" });
    })
    .catch(() => {
      res.send({ code: 500, msg: "添加失败" });
    });
});

router.get("/getAllFoods", (req, res) => {
  Food.find({}).then((data) => {
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

router.get("/changeOrderType", (req, res) => {
  Food.find({}).then((data) => {
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

/**
 * @api {post} /food/page 商品列表
 * @apiName 商品列表
 * @apiGroup Food
 *
 * @apiParam {Number} pageNo 页数
 * @apiParam {Number} pageSize 条数
 * @apiParam {Number} typeid 分类id
 * @apiParam {Number} key 关键字查询
 */
router.post("/page", (req, res) => {
  const pageNo = Number(req.body.pageNo) || 1;
  const pageSize = Number(req.body.pageSize) || 10;
  const { orderNo } = req.body;
  let query = { $or: [{ orderNo: { $regex: orderNo } }] };
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
