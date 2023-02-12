'use strict'
const express = require("express")

const roomController = require("../controllers/room")
const router = new express.Router()

router.post("/add", roomController.addRoom)
router.put("/update/:id_room", roomController.updateRoom)
router.delete("/delete/:id_room", roomController.deleteRoom)
router.get("/", roomController.findAllRoom)
router.get("/room-type/:id_room_type", roomController.findRoomByIdRoomType)
router.post("/find/available", roomController.findRoomByFilterDate)

module.exports = router