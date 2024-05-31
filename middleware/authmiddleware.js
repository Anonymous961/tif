const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const reqAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1]
    try {
        const details = jwt.decode(token);
        const user = await prisma.user.findFirst({
            where: {
                id: details.id
            }
        })
        req.user = user;
    } catch (error) {
        console.error(error);
        res.status(200).json({ error })
    }
    next();
}

module.exports = reqAuth;