const express = require("express");
const router = express.Router();
const Classification = require("../db/model/classificationModel");
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

module.exports = router;
