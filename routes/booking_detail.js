'use strict'
const express = require("express")

const bookingDetailController = require("../controllers/booking_detail")
const router = new express.Router()

router.get("/", bookingDetailController.getAllBookingDetail)

module.exports = router