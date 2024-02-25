const express = require("express");
const router = express.Router();
const Classification = require("../db/model/classificationModel");
const Food = require('../db/model/foodModel')
const { formatDateTime } = require("../utils/time");

router.post("/add", (req, res) => {
  let { className, classDesc } = req.body;
  Classification.find({ className })
    .then((data) => {
      if (data.length > 0) {
        return res.send({ code: 500, msg: "分类已存在" });
      }
    })
    .then(() => {
      return Classification.insertMany({ className, classDesc });
    })
    .then(() => {
      res.send({ code: 200, msg: "创建成功" });
    })
    .catch(() => {
      res.send({ code: 500, msg: "创建失败" });
    });
});

router.post('/Update', (req, res) => {
  let { className, classDesc, _id } = req.body;
  Classification.find({ className })
    .then((data) => {
      if (data.length > 0) {
        return res.send({ code: 500, msg: "分类已存在" });
      }
    })
    .then(() => {
      return Classification.updateOne({ _id }, { className, classDesc });
    })
    .then(() => {
      res.send({ code: 200, msg: "修改成功" });
    })
    .catch(() => {
      res.send({ code: 500, msg: "修改失败" });
    });
})

router.post('/del', (req, res) => {
  const { _id } = req.body

  Classification.remove({ _id })
    .then((data) => {
      res.send({ code: 200, msg: '删除成功' })
    })
    .catch(() => {
      res.send({ code: 500, msg: '删除失败' })
    })
})

router.post('/NoClassPage', (req, res) => {
  const pageNo = Number(req.body.pageNo) || 1
  const pageSize = Number(req.body.pageSize) || 10
  const { isType, name, CargoSpace } = req.body
  let query = { isType, $or: [{ name: { $regex: name } }, { CargoSpace: { $regex: CargoSpace } }] }
  Food.countDocuments(query, (err, count) => {
    if (err) {
      res.send({ code: 500, msg: '商品列表获取失败' })
      return
    }
    Food.aggregate([
      {
        $match: query
      },
      {
        $skip: pageSize * (pageNo - 1)
      },
      {
        $limit: pageSize
      },
    ], function (err, docs) {
      if (err) {
        res.send({ code: 500, msg: '商品列表获取失败' })
        return;
      }
      res.send({
        code: 200,
        data: docs,
        total: count,
        pageNo: pageNo,
        pageSize: pageSize,
        msg: '商品列表获取成功',
      })
    })
  })
})
router.get('/page', (req, res) => {
  let { _id } = req.query
  let query = {};
  if (_id != '') {
    query['_id'] = _id
  }
  Classification.find(query).then((data, err) => {
    if (err) {
      res.send({ code: 500, msg: '商品列表获取失败' })
      return;
    }
    res.send({
      code: 200,
      data: data,
    })
  })
})

router.post('/queryClass', (req, res) => {
  const pageNo = Number(req.body.pageNo) || 1
  const pageSize = Number(req.body.pageSize) || 10
  const { typeid } = req.body
  Food.countDocuments({ typeid }, (err, count) => {
    if (err) {
      res.send({ code: 500, msg: '商品列表获取失败' })
      return
    }
    Food.aggregate([
      {
        $match: { typeid }
      },
      {
        $skip: pageSize * (pageNo - 1)
      },
      {
        $limit: pageSize
      },
    ], function (err, docs) {
      if (err) {
        res.send({ code: 500, msg: '商品列表获取失败' })
        return;
      }
      res.send({
        code: 200,
        data: docs,
        total: count,
        pageNo: pageNo,
        pageSize: pageSize,
        msg: '商品列表获取成功',
      })
    })
  })
})



module.exports = router;
