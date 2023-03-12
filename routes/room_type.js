'use strict'
const express = require("express")

const roomTypeController = require("../controllers/room_type")
const { upload } = require("../utils/upload")
const router = new express.Router()
const auth = require("../auth/auth")

router.post("/add", auth.authVerify, upload.single("photo"), roomTypeController.addRoomType)
router.put("/update/:id_room_type", auth.authVerify, upload.single("photo"), roomTypeController.updateRoomType)
router.delete("/delete/:id_room_type", auth.authVerify, roomTypeController.deleteRoomType)
router.get("/", roomTypeController.getAllRoomType)
router.get("/:id_room_type", roomTypeController.getOneRoomType)
router.post("/find/filter", roomTypeController.findRoomTypeDataFilter)

module.exports = router