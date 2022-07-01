const jwt = require("jsonwebtoken");
const adminModel = require("../model/adminModel");
//const validator = require("email-validator");

const isValid = function (value) {
    if (typeof value == undefined || value == null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const createAdmin = async function (req, res) {
    try {
        let admin = req.body
        if (Object.keys(admin).length > 0) {

            // Checking Validation********************

            if (!isValid(admin.fname)) { return res.status(400).send({ status: false, msg: "FirstName is required" }) }
            if (!isValid(admin.lname)) { return res.status(400).send({ status: false, msg: "LastName is required" }) }
            if (!isValid(admin.phone)) { return res.status(400).send({ status: false, msg: "phone no is required" }) }
            if (!isValid(admin.email)) { return res.status(400).send({ status: false, msg: "email is required" }) }
            if (!isValid(admin.password)) { return res.status(400).send({ status: false, msg: "password is required" }) }

        }
        //  checking uniqueness*************

        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(admin.email))) {
            return res.status(400).send({ status: false, msg: "Please provide a valid email" })
        }
        if (!(/^[6-9]\d{9}$/.test(admin.phone))) {
            return res.status(400).send({ status: false, msg: "please provide a valid phone Number" })
        }

        let dupli = await adminModel.findOne({ email: admin.email })

        if (dupli) { return res.status(400).send({ status: false, msg: "Email already exists" }) }

        let dupliPhone = await adminModel.findOne({ phone: admin.phone })

        if (dupliPhone) { return res.status(400).send({ status: false, msg: "Phone Number already exists" }) }


        let adminCreated = await adminModel.create(admin)
        res.status(201).send({ status: true, msg: "admin successfully created", data: adminCreated })
    } catch (error) {
        return res.status(500).send({ msg: "Error", error: error.message })
    }
}

const loginAdmin = async function (req, res) {
    try {
        let email = req.body.email;
        let password = req.body.password;
        if (!email || !password) {
            return res.status(400).send({ msg: "Please input both email and password." })
        }
        let admin = await adminModel.findOne({ email: email, password: password });
        if (!admin) {
            return res.status(404).send({
                status: false,
                msg: "email or the password is not correct",
            });
        }
        let token = jwt.sign(
            {
                adminId: admin._id.toString()
            },
            "secret-Key"
        );
        res.setHeader("x-api-key", token);
        return res.status(201).send({ status: true,msg:"Token created", data: token });
    } catch (error) {
        return res.status(500).send({ msg: "Error", error: error.message })
    }
};


module.exports.loginAdmin = loginAdmin
module.exports.createAdmin = createAdmin