//ini untuk logic nya,
const md5 = require("md5");
const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const jsonwebtoken = require("jsonwebtoken");
const SECRET_KEY = "secretcode";

const model = require("../models/index");
const user = model.user;

const Op = Sequelize.Op;

const login = async (req, res) => {
    try {
        const params = {
            email: req.body.email,
            password: md5(req.body.password),
        };

        const findUser = await user.findOne({ where: params });
        if (findUser == null) {
            return res.status(404).json({
                message: "username or password doesn't match",
            });
        }
        //generate jwt token
        let tokenPayload = {
            id_user: findUser.id_customer,
            email: findUser.email,
            role: findUser.role,
            user_name: findUser.user_name
        };
        tokenPayload = JSON.stringify(tokenPayload);
        let token = await jsonwebtoken.sign(tokenPayload, SECRET_KEY);

        return res.status(200).json({
            message: "Success login",
            data: {
                logged: true,
                token: token,
                id_user: findUser.id_user,
                email: findUser.email,
                role: findUser.role,
                user_name: findUser.user_name
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

const addUser = async (req, res) => {
    try {
        const data = {
            user_name: req.body.user_name,
            photo: req.file.filename,
            email: req.body.email,
            password: md5(req.body.password),
            role: req.body.role,
        };

        await user.create(data);
        return res.status(200).json({
            message: "Success create user",
            data: {
                user_name: data.user_name,
                photo: data.photo,
                email: data.email,
                role: data.role,
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const params = {
            id_user: req.params.id_user,
        };
        const data_edit = {
            user_name: req.body.user_name,
            email: req.body.email,
            role: req.body.role,
        };

        const result = await user.findOne({ where: params });
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!",
            });
        }

        if (req.file) {
            try {
                const oldFileName = result.photo;

                //delete old file
                const dir = path.join(__dirname, "../uploads/image", oldFileName);
                fs.unlink(dir, (err) => console.log(err));
            } catch (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error while update file",
                    err: err,
                });
            }

            //set new image
            data_edit.photo = req.file.filename;
        }

        await user.update(data_edit, { where: params });
        return res.status(200).json({
            message: "Success update user",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const params = {
            id_user: req.params.id_user,
        };
        const result = await user.findOne({ where: params });
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }
        try {
            const oldFileName = result.photo;

            //delete old file
            const dir = path.join(__dirname, "../uploads/image", oldFileName);
            fs.unlink(dir, (err) => console.log(err));
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error while delete file",
                err: err,
            });
        }

        await user.destroy({ where: params });
        return res.status(200).json({
            message: "Success delete user",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

const findAllUser = async (req, res) => {
    try {
        const allUser = await user.findAll();
        return res.status(200).json({
            message: "Succes to get all user",
            count: allUser.length,
            data: allUser,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal error",
            err: err,
        });
    }
};

const findOneUser = async (req, res) => {
    try {
        const params = {
            id_user: req.params.id_user,
        };
        const result = await user.findOne({ where: params });
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }
        return res.status(200).json({
            message: "Success to get one user",
            code: 200,
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

const findAllUserRoleResepsionis = async (req, res) => {
    try {
        const result = await user.findAll({
            where: {
                role: "resepsionis"
            }
        });
        return res.status(200).json({
            message: "Succes to get all user",
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

const findUserDataFilter = async (req, res) => {
    try {
        const keyword = req.body.keyword

        const result = await user.findAll({
            where: {
                [Op.or]: {
                    user_name: { [Op.like]: `%${keyword}%` },
                    email: { [Op.like]: `%${keyword}%` },
                    role: { [Op.like]: `%${keyword}%` }
                }
            }
        });

        return res.status(200).json({
            message: "Succes to get all user by filter",
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
    login,
    addUser,
    updateUser,
    deleteUser,
    findAllUser,
    findOneUser,
    findAllUserRoleResepsionis,
    findUserDataFilter
};
