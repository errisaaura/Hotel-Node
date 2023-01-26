'use strict'
const express = require("express")

const roomTypeController = require("../controllers/room_type")
const { upload } = require("../utils/upload")
const router = new express.Router()

router.post("/add", upload.single("photo"), roomTypeController.addRoomType)
router.put("/update/:id_room_type", upload.single("photo"), roomTypeController.updateRoomType)
router.delete("/delete/:id_room_type", roomTypeController.deleteRoomType)
router.get("/", roomTypeController.getAllRoomType)
router.get("/:id_room_type", roomTypeController.getOneRoomType)

module.exports = router