const jwt = require("jsonwebtoken");
//const userModel = require("../model/userModel");
const adminModel = require("../model/adminModel");

const authCheck = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        let decodedtoken = jwt.verify(token, "secret-Key")

        let userId = req.params.userId
        if (userId) {
            let adminId = await adminModel.find({ _id: userId }).select({ adminId: 1, _id: 0 })
            adminId = adminId.map(x => x.adminId)

            if (decodedtoken.adminId != adminId) return res.status(403).send({ status: false, msg: "You haven't right to perform this task" })
        }
        else {
            let adminId = req.query.adminId
            if (!adminId) return res.status(400).send({ error: "Please, enter adminId" })
            if (decodedtoken.adminId != adminId) return res.status(403).send({ status: false, msg: "You haven't right to perform this task" })
        }
        next()
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}

module.exports.authCheck = authCheck;


// try {
//     let token = req.headers["x-api-key"];
//     let decodedToken = jwt.verify(token, "secret-Key");
//     let userId = req.params.userId;
//     if (userId != decodedToken.userId) return res.status(401).send({ status: false, msg: "You are not authorized to access this part." })
//     next();
// } catch (error) {
//     return res.status(500).send({ msg: "Error", error: error.message })
// }
// }