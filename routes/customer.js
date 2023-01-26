'use strict'
const express = require("express")

const customerController = require("../controllers/customer")
const router = new express.Router()


router.post("/register", customerController.register)
router.post("/login", customerController.login)
router.put("/update/:id_customer", customerController.updateCustomer)
router.delete("/delete/:id_customer", customerController.deleteCustomer)
router.get("/", customerController.findAllCustomer)
router.get("/:id_customer", customerController.findOneCustomer)

module.exports = router