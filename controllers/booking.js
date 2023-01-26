const sequelize = require("sequelize");
const moment = require("moment");

const Op = sequelize.Op;

const model = require("../models/index");
const booking = model.booking;
const bookingDetail = model.detail_booking;
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

        //get data customer
        let customerData = await customer.findOne({
            where: {
                id_customer: data.id_customer,
            },
        });

        const payloadData = {
            id_user: data.id_user,
            id_customer: data.id_customer,
            id_room_type: data.id_room_type,
            booking_number: data.booking_number,
            name_customer: customerData.customer_name, //ini maunya ambil dr tabel cust
            email: customerData.email, //ini maunya ambil dr tabel cust
            booking_date: data.booking_date,
            check_in_date: data.check_in_date,
            check_out_date: data.check_out_date,
            guest_name: data.guest_name,
            total_room: data.total_room,
            booking_status: "baru",
        };

        //get data room where room is available in table room and tidak ada data yang di detail
        let roomsData = await room.findAll({
            where: {
                id_room_type: data.id_room_type,
                room_is_available: true,
            },
        });

        // console.log(roomsData.room.dataValues.id_room)
        // let result = roomsData
        let id_available = []
        for (let i = 0; i < roomsData.length; i++) {
            // console.log(roomsData[i].dataValues.id_room)
            id_available[i] = roomsData[i].dataValues.id_room
        }

        // console.log(id_available)


        // check berdasaran tanggal
        const checkTanggal = await bookingDetail.findAll({
            '$booking.check_in_date': { [Op.between]: [payloadData.check_in_date, payloadData.check_out_date] },

        })

        for(let i = 0; i < id_available.length; i++){
            for(let j = 0; j < checkTanggal.length; j++){
                if(id_available[i] === checkTanggal[j].dataValues.id_room){
                    console.log(id_available[i])
                }else{
                    console.log(id_available.length + ' ' + checkTanggal.length)
                }
                // console.log('CheckTanggal',checkTanggal[j].dataValues.id_room)
                // con
            }
        }

        // console.log(checkTanggal)

        //process add detail ; cek kondisi room yg ada
        if (roomsData == null || roomsData.length < data.total_room) {
            return res.status(404).json({
                message: "Room not found",
                code: 404,
            });
        }

        try {
            // const result = await booking.create(payloadData);
            // let roomTypeData = await roomType.findOne({
            //     where: { id_room_type: data.id_room_type },
            // });

            // let roomsDataSelected = [];

            // //add data room where status is available to one listArray
            // for (let i = 0; i < data.total_room; i++) {
            //     roomsDataSelected.push(roomsData[i]);
            //     room.update(
            //         { room_is_available: false },
            //         { where: { id_room: roomsData[i].id_room } }
            //     );
            // }

            //add data to booking detail
            // let checkInDate = new Date(data.check_in_date);
            // let checkOutDate = new Date(data.check_out_date);
            // let dayTotal =
            //     (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24);

            // for (let i = 0; i < dayTotal; i++) {
            //     for (let j = 0; j < roomsDataSelected.length; j++) {
            //         let accessDate = new Date(checkInDate);
            //         accessDate.setDate(accessDate.getDate() + i);
            //         let dataBookingDetail = {
            //             id_booking: result.id_booking,
            //             id_room: roomsDataSelected[j].id_room,
            //             access_date: accessDate,
            //             total_price: roomTypeData.price,
            //         };
            //         await bookingDetail.create(dataBookingDetail);
            //     }
            // }

            // return res.status(200).json({
            //     data: roomsDataSelected,
            //     message: "Success to create booking room",
            //     code: 200,
            // });
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

const getOneBooking = async (req, res) => {
    try {
        const params = {
            id_booking: req.params.id_booking,
        };

        const result = await booking.findOne({
            include: ["user", "customer", "room_type"],
            where: params,
        });

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
            // include: ["room_type"],
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

findBookingDataFilter = async (req, res) => {
    try {
        // const keyword = req.body.keyword
        const checkInDate = req.body.check_in_date;
        const checOutDate = req.body.check_out_date;

        const result = await booking.findAll({
            // include: ["user", "room_type", "customer"],
            // where: {
            //     [Op.or]: {
            //         booking_number: { [Op.like]: `%${keyword}%` },
            //         name_customer: { [Op.like]: `%${keyword}%` },
            //         email: { [Op.like]: `%${keyword}%` },
            //         guest_name: { [Op.like]: `%${keyword}%` }
            //     }

            // },
            check_in_date: {
                [Op.between]: [checkInDate, checOutDate],
            },
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
            // include: ["room_type"],
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

module.exports = {
    addBookingRoom,
    getAllBooking,
    getOneBooking,
    findBookingDataFilter,
    findBookingByNameCustomer,
};
