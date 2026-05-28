const express = require("express");

const { getAddressList } = require("../controllers/addressCtrl");

const router = express.Router();

router.get("/all-address", getAddressList); // Route lấy danh sách địa chỉ

module.exports = router;

