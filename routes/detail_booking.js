'use strict'
const express = require("express")

const bookingDetailController = require("../controllers/detail_booking")
const router = new express.Router()

router.get("/", bookingDetailController.getAllBookingDetail)
router.delete("/delete/:id_detail_booking", bookingDetailController.deleteBookingDetail)
router.post("/find/access_date", bookingDetailController.findBookingDetail)

module.exports = router