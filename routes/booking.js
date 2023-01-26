'use strict'
const express = require("express")

const bookingController = require("../controllers/booking")
const router = new express.Router()

router.post("/add", bookingController.addBookingRoom)
router.get("/", bookingController.getAllBooking)
router.get("/:id_booking", bookingController.getOneBooking)

router.post("/find/name-customer", bookingController.findBookingByNameCustomer)
router.post("/find/filter", bookingController.findBookingDataFilter)

module.exports = router