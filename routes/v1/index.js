const express = require("express")
const roleRouter = require("./role")
const userRouter = require("./user")
const communityRouter = require("./community")
const memberRouter = require("./member")
const router = express.Router();

router.use('/role', roleRouter)
router.use("/auth", userRouter);
router.use("/community", communityRouter)
router.use("/member", memberRouter)

module.exports = router;