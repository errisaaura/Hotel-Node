'use strict'
const express = require("express")

const roomController = require("../controllers/room")
const router = new express.Router()
const auth = require("../auth/auth")

router.post("/add", auth.authVerify, roomController.addRoom)
router.put("/update/:id_room", auth.authVerify, roomController.updateRoom)
router.delete("/delete/:id_room", auth.authVerify, roomController.deleteRoom)
router.get("/", roomController.findAllRoom)
router.get("/room-type/:id_room_type", roomController.findRoomByIdRoomType)
router.post("/find/available", roomController.findRoomByFilterDate)
router.post("/find/filter", roomController.findRoomDataFilter)

module.exports = router