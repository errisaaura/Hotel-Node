const model = require("../models/index");
const bookingDetail = model.detail_booking;
const sequelize = require("sequelize")

const Op = sequelize.Op

const getAllBookingDetail = async (req, res) => {
    try {
        const result = await bookingDetail.findAll({
            include: ["booking", "room"],
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

const findBookingDetail = async (req, res) => {
    try {
        const keyword = new Date(req.body.keyword)

        const result = await bookingDetail.findAll({
            include: ["booking", "room"],
            where: {
                [Op.or]: {
                    access_date: { [Op.like]: `%${keyword}%` }
                }
            }
        })

        return res.status(200).json({
            message: "Succes to get booking",
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

const deleteBookingDetail = async (req, res) => {
    try {
        const params = {
            id_detail_booking: req.params.id_detail_booking
        }

        const findData = await bookingDetail.findOne({ where: params })
        if (findData == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

        await bookingDetail.destroy({ where: params })
        return res.status(200).json({
            message: "Succes to delete detail booking",
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
    getAllBookingDetail,
    findBookingDetail,
    deleteBookingDetail
};
