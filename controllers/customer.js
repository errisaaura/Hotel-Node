const jsonwebtoken = require("jsonwebtoken")
const md5 = require('md5')
const Sequelize = require("sequelize")
const SECRET_KEY = "secretcode"

const model = require("../models/index")
const customer = model.customer

const Op = Sequelize.Op;

const register = async (req, res) => {
    try {
        let data = {
            nik: req.body.nik,
            customer_name: req.body.customer_name,
            address: req.body.address,
            email: req.body.email,
            password: md5(req.body.password)
        }

        await customer.create(data)
        return res.status(200).json({
            "message": "Success register customer",
            "data": {
                nik: data.nik,
                customer_name: data.customer_name,
                address: data.address,
                email: data.email
            },
            "code": 200
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal error",
            err: err
        });
    }
}

const login = async (req, res) => {
    try {
        const params = {
            email: req.body.email,
            password: md5(req.body.password)
        }

        const findCustomer = await customer.findOne({ where: params })
        if (findCustomer == null) {
            return res.status(404).json({
                message: "username or password doesn't match",
                code: 404
            })
        }
        //generate jwt token
        let tokenPayload = {
            id_customer: findCustomer.id_customer,
            email: findCustomer.email,
            role: "customer"
        }
        tokenPayload = JSON.stringify(tokenPayload)
        let token = await jsonwebtoken.sign(tokenPayload, SECRET_KEY)

        //result
        return res.status(200).json({
            message: "Success login",
            data: {
                token: token,
                id_customer: findCustomer.id_customer,
                email: findCustomer.email,
                role: "customer"
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal error",
            err: err
        });
    }
}

const updateCustomer = async (req, res) => {
    try {
        const params = {
            id_customer: req.params.id_customer
        }
        const data_edit = {
            nik: req.body.nik,
            customer_name: req.body.customer_name,
            address: req.body.address,
            email: req.body.email
        }

        const result = await customer.findOne({ where: params })
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }

        await customer.update(data_edit, { where: params })
        return res.status(200).json({
            message: "Success update customer",
            code: 200
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal error",
            err: err
        });
    }
}
const deleteCustomer = async (req, res) => {
    try {
        const params = {
            id_customer: req.params.id_customer
        }
        const result = await customer.findOne({ where: params })
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }
        await customer.destroy({ where: params })
        return res.status(200).json({
            message: "Success to delete customer",
            code: 200
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal error",
            err: err
        });
    }
}

const findAllCustomer = async (req, res) => {
    try {
        const result = await customer.findAll()
        return res.status(200).json({
            message: "Succes to get all customer",
            code: 200,
            count: result.length,
            data: result
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal error",
            err: err
        });
    }
}

const findOneCustomer = async (req, res) => {
    try {
        const params = {
            id_customer: req.params.id_customer
        }
        const result = await customer.findOne({ where: params })
        if (result == null) {
            return res.status(404).json({
                message: "Data not found!"
            });
        }
        return res.status(200).json({
            message: "Success to get one customer",
            code: 200,
            data: result
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal error",
            err: err
        });
    }
}

const findCustomerDataFilter = async (req, res) => {
    try {
        const keyword = req.body.keyword

        const result = await customer.findAll({
            where: {
                [Op.or]: {
                    nik: { [Op.like]: `%${keyword}%` },
                    customer_name: { [Op.like]: `%${keyword}%` },
                    address: { [Op.like]: `%${keyword}%` },
                    email: { [Op.like]: `%${keyword}%` }
                }
            }
        });

        return res.status(200).json({
            message: "Succes to get all customer by filter",
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
    register,
    updateCustomer,
    deleteCustomer,
    findAllCustomer,
    findOneCustomer,
    findCustomerDataFilter
}