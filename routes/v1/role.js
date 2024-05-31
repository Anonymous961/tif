const express = require('express')
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { Snowflake } = require("@theinternetfolks/snowflake")


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const role = await prisma.role.findMany()
        console.log(role)
        res.json({
            "status": true,
            "content": {
                "meta": {
                    "total": 2,
                    "pages": 1,
                    "page": 1
                },
                "data": role   //unable to serialize
            }
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({})
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
        res.status(400).json({ error })
    }
})

module.exports = router;
