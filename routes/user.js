//ini nanti endpointnya
'use strict'
const express = require('express')

const userController = require("../controllers/user")
const { upload } = require("../utils/upload")
const router = new express.Router()
const auth = require("../auth/auth")


router.post("/login", userController.login)
router.post("/add", upload.single("photo"), userController.addUser)
router.put("/update/:id_user", auth.authVerify, upload.single("photo"), userController.updateUser)
router.delete("/delete/:id_user", auth.authVerify, userController.deleteUser)
router.get("/", userController.findAllUser)
router.get("/:id_user", auth.authVerify, userController.findOneUser)
router.get("/role/resepsionis", userController.findAllUserRoleResepsionis)
router.post("/find/filter", userController.findUserDataFilter)



module.exports = router

