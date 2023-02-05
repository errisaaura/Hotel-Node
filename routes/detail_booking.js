'use strict'
const express = require("express")

const bookingDetailController = require("../controllers/detail_booking")
const router = new express.Router()

router.get("/", bookingDetailController.getAllBookingDetail)

module.exports = router