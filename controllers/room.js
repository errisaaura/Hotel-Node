const Sequelize = require("sequelize");

const model = require("../models/index");
const room = model.room;

const addRoom = async (req, res) => {
    try {
        const data = {
            room_number: req.body.room_number,
            id_room_type: req.body.id_room_type,
            room_is_available: true,
        };

        await room.create(data);
        return res.status(200).json({
            message: "Success create room",
            data: data,
            code: 200,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

const updateRoom = async (req, res) => {
    try {
        const params = {
            id_room: req.params.id_room,
        };
        const data_edit = {
            room_number: req.body.room_number,
            id_room_type: req.body.id_room_type,
        };

        await room.update(data_edit, { where: params });
        return res.status(200).json({
            message: "Success update room",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const params = {
            id_room: req.params.id_room,
        };
        await room.destroy({ where: params });
        return res.status(200).json({
            message: "Success to delete room",
            code: 200,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

//get all room include roomType
const findAllRoom = async (req, res) => {
    try {
        const result = await room.findAll({
            include: ["room_type"],
        });

        return res.status(200).json({
            message: "Success to get all room",
            code: 200,
            count: result.length,
            data: result,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

//findAllRoom berdasarkan roomtype
const findRoomByIdRoomType = async (req, res) => {
    try {
        const params = {
            id_room_type: req.params.id_room_type,
        };

        const result = await room.findAll({
            include: ["room_type"],
            where: params,
        });
        return res.status(200).json({
            message: "Succes to get all room by type room",
            code: 200,
            count: result.length,
            data: result,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

module.exports = {
    addRoom,
    updateRoom,
    deleteRoom,
    findAllRoom,
    findRoomByIdRoomType,
};
