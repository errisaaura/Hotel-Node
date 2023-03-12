const Sequelize = require("sequelize");

const model = require("../models/index");
const room = model.room;
const roomType = model.room_type
const detailBooking = model.detail_booking

const Op = Sequelize.Op

const addRoom = async (req, res) => {
    try {
        const data = {
            room_number: req.body.room_number,
            id_room_type: req.body.id_room_type,
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

        const result = await room.findOne({ where: params })
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

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

        const result = await room.findOne({ where: params })
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

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

        const resultRoomType = await roomType.findOne({ where: params })
        if (resultRoomType == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

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

const findRoomByFilterDate = async (req, res) => {
    const checkInDate = req.body.check_in_date
    const checkOutDate = req.body.check_out_date

    if (checkInDate === "" || checkOutDate === "") {
        return res.status(200).json({
            message: "null",
            code: 200,
            room : []
        });
    }

    const roomData = await roomType.findAll({
        attributes: ["id_room_type", "name_room_type", "price", "description", "photo"],
        include: [
            {
                model: room,
                as: "room"

            }
        ]
    })

    const roomBookedData = await roomType.findAll({
        atrributes: ["id_room_type", "name_room_type", "price", "description", "photo"],
        include: [
            {
                model: room,
                as: "room",
                include: [
                    {
                        model: detailBooking,
                        as: "detail_booking",
                        attributes: ["access_date"],
                        where: {
                            access_date: {
                                [Op.between]: [checkInDate, checkOutDate]
                            }
                        }
                    }
                ]
            }
        ]
    })

    const available = []
    const availableByType = []

    for (let i = 0; i < roomData.length; i++) {
        roomData[i].room.forEach((room) => {
            let isBooked = false
            roomBookedData.forEach((booked) => {
                booked.room.forEach((bookedRoom) => {
                    if (room.id_room === bookedRoom.id_room) {
                        isBooked = true
                    }
                })
            })

            if (!isBooked) {
                available.push(room)
            }
        })
    }

    for (let i = 0; i < roomData.length; i++) {
        let roomType = {}
        roomType.id_room_type = roomData[i].id_room_type
        roomType.name_room_type = roomData[i].name_room_type
        roomType.price = roomData[i].price
        roomType.description = roomData[i].description
        roomType.photo = roomData[i].photo
        roomType.room = []
        available.forEach((room) => {
            if (room.id_room_type === roomData[i].id_room_type) {
                roomType.room.push(room)
            }
        })
        if (roomType.room.length > 0) {
            availableByType.push(roomType)
        }
    }

    return res.status(200).json({
        message: "Succes to get available room by type room",
        code: 200,
        roomAvailable: available,
        roomAvailableCount: available.length,
        room: availableByType,
        typeRoomCount: availableByType.length
    });

}

const findRoomDataFilter = async (req, res) => {
    try {
        const keyword = req.body.keyword

        const result = await room.findAll({
            include: ["room_type"],
            where: {
                [Op.or]: {
                    room_number: { [Op.like]: `%${keyword}%` }
                }
            }
        });

        return res.status(200).json({
            message: "Succes to get all room by filter",
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
    findRoomByFilterDate,
    findRoomDataFilter
};
