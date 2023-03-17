'use strict'
const express = require("express")
const auth = require("../auth/auth")

const bookingController = require("../controllers/booking")
const router = new express.Router()

router.post("/add", auth.authVerify, bookingController.addBookingRoom)
router.put("/update/status/:id_booking", auth.authVerify, bookingController.updateStatusBooking)
router.delete("/delete/:id_booking", auth.authVerify, bookingController.deleteOneBooking)

router.get("/", bookingController.getAllBooking)
router.get("/:id_booking", bookingController.getOneBooking)
router.post("/find/name-customer", bookingController.findBookingByNameCustomer)
router.post("/find/filter/:id_customer", bookingController.findBookingDataFilter)
router.get("/customer/:id_customer", auth.authVerify, bookingController.findBookingByIdCustomer)
router.post("/find/filter", bookingController.findBookingDataFilterForUser)

module.exports = router