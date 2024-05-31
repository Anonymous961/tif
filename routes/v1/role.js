const express = require('express')
const client = require("@prisma/client")
const { PrismaClient } = client;
const prisma = new PrismaClient();
const { Snowflake } = require("@theinternetfolks/snowflake")


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const role = await prisma.role.findMany()
        res.json(role)
    } catch (error) {
        console.error(error)
        res.status(200).json({})
    }
})
router.post('/', async (req, res) => {
    const { name } = req.body;
    const id = Snowflake.generate();
    try {
        const role = await prisma.role.create({
            data: {
                id,
                name
            }
        })
        res.json({
            "status": true,
            "content": {
                "data": { ...role, id: role.id.toString() }
            }
        })
    } catch (error) {
        console.error(error)
        res.status(200).json({ error })
    }
})

module.exports = router;
