'use strict'
const express = require("express")

const customerController = require("../controllers/customer")
const router = new express.Router()

const auth = require("../auth/auth")

router.post("/register", customerController.register)
router.post("/login", customerController.login)
router.put("/update/:id_customer", auth.authVerify, customerController.updateCustomer)
router.delete("/delete/:id_customer", auth.authVerify, customerController.deleteCustomer)
router.get("/", customerController.findAllCustomer)
router.get("/:id_customer", customerController.findOneCustomer)
router.post("/find/filter", customerController.findCustomerDataFilter)

module.exports = router