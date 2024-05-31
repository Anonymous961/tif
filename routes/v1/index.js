const express = require("express")
const roleRouter = require("./role")
const router = express.Router();

router.use('/role', roleRouter)


module.exports = router;