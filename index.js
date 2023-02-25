const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname))
app.use(cors());

app.get("/", (req, res) => {
    res.send("Ini nyoba port");
});

//ini untuk mengatur dr module routes
app.use("/user", require("./routes/user"));
app.use("/room-type", require("./routes/room_type"));
app.use("/customer", require("./routes/customer"));
app.use("/room", require("./routes/room"));
app.use("/booking", require("./routes/booking"));
app.use("/booking-detail", require("./routes/detail_booking"));

const port = 8080;
app.listen(port, () => {
    console.log(`Server di port ${port}`);
});
