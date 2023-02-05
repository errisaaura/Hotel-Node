const model = require("../models/index");
const bookingDetail = model.detail_booking;

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

module.exports = {
    getAllBookingDetail,
};
