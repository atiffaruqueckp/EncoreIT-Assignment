const express = require('express');
const router = express.Router();

const userController = require("../controller/userController")
const adminController = require("../controller/adminController")
const authenticate = require("../middleware/authentication");
//const authorize = require("../middleware/authorization")
// register admin

router.post("/admin", adminController.createAdmin)
// login admin

router.post("/login", adminController.createAdmin)
//register user

router.post("/users", userController.createUser)

// login user
router.post("/login", userController.loginUser)

//get user list
router.get("/users", authenticate.authenticate, userController.getUser)

module.exports = router;