const sequelize = require("sequelize");
const moment = require("moment");

const Op = sequelize.Op;

const model = require("../models/index");
const booking = model.booking;
const detailBooking = model.detail_booking;
const room = model.room;
const roomType = model.room_type;
const customer = model.customer;

const addBookingRoom = async (req, res) => {
    try {
        const data = {
            id_user: req.body.id_user,
            id_customer: req.body.id_customer,
            id_room_type: req.body.id_room_type,
            booking_number: req.body.booking_number,
            booking_date: req.body.booking_date,
            check_in_date: req.body.check_in_date,
            check_out_date: req.body.check_out_date,
            guest_name: req.body.guest_name,
            total_room: req.body.total_room,
            booking_status: "baru",
        };

        // customer data
        const customerData = await customer.findOne({
            where: { id_customer: data.id_customer }
        })
        if (customerData == null) {
            return res.status(404).json({
                message: "Data customer not found!"
            });
        }

        data.name_customer = customerData.customer_name
        data.email = customerData.email

        // rooms data
        let roomsData = await room.findAll({
            where: {
                id_room_type: data.id_room_type
            }
        });

        //room type data
        let roomTypeData = await roomType.findAll({
            where: { id_room_type: data.id_room_type }
        })
        if (roomTypeData == null) {
            return res.status(404).json({
                message: "Data room type not found!"
            });
        }

        //cek room yang ada pada tabel booking_detail
        let dataBooking = await roomType.findAll({
            where: { id_room_type: data.id_room_type },
            include: [
                {
                    model: room,
                    as: "room",
                    attributes: ["id_room", "id_room_type"],
                    include: [
                        {
                            model: detailBooking,
                            as: "detail_booking",
                            attributes: ["access_date"],
                            where: {
                                access_date: {
                                    [Op.between]: [data.check_in_date, data.check_out_date]
                                }
                            }
                        }
                    ]

                }
            ]
        })

        // get available rooms
        const bookedRoomIds = dataBooking[0].room.map((room) => room.id_room)
        const availableRooms = roomsData.filter((room) => !bookedRoomIds.includes(room.id_room))

        //proses add data room yang available to one array
        const roomsDataSelected = availableRooms.slice(0, data.total_room)

        //count day 
        const checkInDate = new Date(data.check_in_date)
        const checkOutDate = new Date(data.check_out_date)
        const dayTotal = Math.round((checkOutDate - checkInDate) / (1000 * 3600 * 24))

        //process add booking and detail
        try {
            if (roomsData == null || availableRooms.length < data.total_room || dayTotal == 0 || roomsDataSelected == null) {
                return res.status(404).json({
                    message: "Room not found",
                    code: 404,
                });
            }

            const result = await booking.create(data)
            //add detail
            for (let i = 0; i < dayTotal; i++) {
                for (let j = 0; j < roomsDataSelected.length; j++) {
                    const accessDate = new Date(checkInDate)
                    accessDate.setDate(accessDate.getDate() + i)
                    const dataDetailBooking = {
                        id_booking: result.id_booking,
                        id_room: roomsDataSelected[j].id_room,
                        access_date: accessDate,
                        total_price: roomTypeData[0].price

                    }
                    await detailBooking.create(dataDetailBooking)
                }

            }
            return res.status(200).json({
                data: result,
                message: "Success to create booking room",
                code: 200,
            });

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error when create booking",
                err: err,
            });

        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

const deleteOneBooking = async (req, res) => {
    try {
        const idBooking = req.params.id_booking
        const findDataBooking = await booking.findOne({
            where: { id_booking: idBooking }
        })
        if (findDataBooking == null) {
            return res.status(404).json({
                message: "Data not found!",
            });
        }

        const findDataDetailBooking = await detailBooking.findAll({ where: { id_booking: idBooking } })
        if (findDataDetailBooking == null) {
            return res.status(404).json({
                message: "Data not found!",
                err: err,
            });
        }

        await detailBooking.destroy({ where: { id_booking: idBooking } })
        await booking.destroy({ where: { id_booking: idBooking } })

        return res.status(200).json({
            message: "Success to delete booking",
            code: 200,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
}

const updateStatusBooking = async (req, res) => {
    try {
        const params = { id_booking: req.params.id_booking }

        const result = booking.findOne({ where: params })
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

        const data = {
            booking_status: req.body.booking_status
        }

        if (data.booking_status == "check_out") {
            await booking.update(data, { where: params })

            const updateTglAccess = {
                access_date: null
            }
            await detailBooking.update(updateTglAccess, { where: params })
            return res.status(200).json({
                message: "Success update status booking to check out",
                code: 200
            })
        }

        await booking.update(data, { where: params })
        return res.status(200).json({
            message: "Success update status booking",
            code: 200
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });

    }
}

const getOneBooking = async (req, res) => {
    try {
        const params = {
            id_booking: req.params.id_booking,
        };

        const result = await booking.findOne({
            include: ["user", "customer", "room_type"],
            where: params,
        });
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

        return res.status(200).json({
            message: "Succes to get one booking",
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

const getAllBooking = async (req, res) => {
    try {
        const result = await booking.findAll({
            include: ["room_type", "detail_booking"],
        });

        return res.status(200).json({
            message: "Succes to get all booking",
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

const findBookingDataFilter = async (req, res) => {
    try {
        const keyword = req.body.keyword

        const result = await booking.findAll({
            include: ["user", "room_type", "customer"],
            where: {
                [Op.or]: {
                    booking_number: { [Op.like]: `%${keyword}%` },
                    name_customer: { [Op.like]: `%${keyword}%` },
                    booking_status: { [Op.like]: `%${keyword}%` },
                    guest_name: { [Op.like]: `%${keyword}%` }
                },
                [Op.and]: {
                    id_customer: req.params.id_customer
                }
            }
        });

        return res.status(200).json({
            message: "Succes to get all booking by filter",
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

const findBookingDataFilterForUser = async (req, res) => {
    try {
        const keyword = req.body.keyword

        const result = await booking.findAll({
            include: ["user", "room_type", "customer"],
            where: {
                [Op.or]: {
                    booking_number: { [Op.like]: `%${keyword}%` },
                    name_customer: { [Op.like]: `%${keyword}%` },
                    booking_status: { [Op.like]: `%${keyword}%` },
                    guest_name: { [Op.like]: `%${keyword}%` }
                }
            }
        });

        return res.status(200).json({
            message: "Succes to get all booking by filter",
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

const findBookingByNameCustomer = async (req, res) => {
    try {
        const keyword = req.body.keyword;

        const result = await booking.findAll({
            include: ["room_type"],
            where: {
                [Op.or]: {
                    name_customer: { [Op.like]: `%${keyword}%` },
                },
            },
        });

        return res.status(200).json({
            message: "Succes to get all booking by customer name",
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

const findBookingByIdCustomer = async (req, res) => {
    try {
        const params = {
            id_customer: req.params.id_customer
        }

        const customerData = await customer.findOne({
            where: params
            
        })
        if (customerData == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

        const result = await booking.findAll({ where: params , include: ["room_type"],})
        return res.status(200).json({
            message: "Succes to get all booking by id customer",
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
}

module.exports = {
    addBookingRoom,
    deleteOneBooking,
    updateStatusBooking,
    getAllBooking,
    getOneBooking,
    findBookingDataFilter,
    findBookingByNameCustomer,
    findBookingByIdCustomer,
    findBookingDataFilterForUser
};
