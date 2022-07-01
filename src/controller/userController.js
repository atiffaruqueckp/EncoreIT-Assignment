const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
//const validator = require("email-validator");

const isValid = function (value) {
    if (typeof value == undefined || value == null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const createUser = async function (req, res) {
    try {
        let user = req.body
        if (Object.keys(user).length > 0) {

            // Checking Validation********************

            if (!isValid(user.fname)) { return res.status(400).send({ status: false, msg: "FirstName is required" }) }
            if (!isValid(user.lname)) { return res.status(400).send({ status: false, msg: "LastName is required" }) }
            if (!isValid(user.phone)) { return res.status(400).send({ status: false, msg: "phone no is required" }) }
            if (!isValid(user.email)) { return res.status(400).send({ status: false, msg: "email is required" }) }
            if (!isValid(user.password)) { return res.status(400).send({ status: false, msg: "password is required" }) }

        }
        //  checking uniqueness*************

        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(user.email))) {
            return res.status(400).send({ status: false, msg: "Please provide a valid email" })
        }
        if (!(/^[6-9]\d{9}$/.test(user.phone))) {
            return res.status(400).send({ status: false, msg: "please provide a valid phone Number" })
        }

        let dupli = await userModel.findOne({ email: user.email })

        if (dupli) { return res.status(400).send({ status: false, msg: "Email already exists" }) }

        let dupliPhone = await userModel.findOne({ phone: user.phone })

        if (dupliPhone) { return res.status(400).send({ status: false, msg: "Phone Number already exists" }) }


        let userCreated = await userModel.create(user)
        res.status(201).send({ status: true, msg: "user successfully created", data: userCreated })
    } catch (error) {
        return res.status(500).send({ msg: "Error", error: error.message })
    }
}

const loginUser = async function (req, res) {
    try {
        let email = req.body.email;
        let password = req.body.password;
        if (!email || !password) {
            return res.status(400).send({ msg: "Please input both email and password." })
        }
        let user = await userModel.findOne({ email: email, password: password });
        if (!user) {
            return res.status(404).send({
                status: false,
                msg: "email or the password is not correct",
            });
        }
        let token = jwt.sign(
            {
                userId: user._id.toString()
            },
            "secret-Key"
        );
        res.setHeader("x-api-key", token);
        return res.status(201).send({ status: true,msg:"Token created", data: token });
    } catch (error) {
        return res.status(500).send({ msg: "Error", error: error.message })
    }
};
const getUser = async function (req, res) {

    try {
      const filters = req.query
      console.log(filters)
      if (Object.keys(filters).length > 0) {
  
        const availableUser= await userModel.find({ $and: [filters, { isDeleted: false }] }).select({ _id: 1, fname: 1, email: 1, userId: 1,})
  
        if (!availableUser.length > 0) {
          return res.status(404).send({ status: false, message: "No user found For Given info" })
        }
  
       
  
        return res.status(200).send({ status: true, message: "user list", data: availableUser })
      }
      else {
        const allUser = await userModel.find()
        return res.status(200).send({ status: true, message: allUser })
      }
    }
  
    catch (err) {
      console.log(err)
      res.status(500).send({ status: "failed", message: err.message })
    }
  
  }


module.exports.loginUser = loginUser
module.exports.createUser = createUser
module.exports.getUser = getUser