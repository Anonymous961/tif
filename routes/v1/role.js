const express = require('express')
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { Snowflake } = require("@theinternetfolks/snowflake");
const utils = require('../../utils');


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalRoles = await prisma.role.count();
        const totalPages = Math.ceil(totalRoles / limit);

        const roles = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
                created_at: true,
                updated_at: true
            },
            skip,
            take: limit
        })
        const serializedData = utils.serializeJSONWithBigInt(roles);
        res.json({
            "status": true,
            "content": {
                "meta": {
                    "total": totalRoles,
                    "pages": totalPages,
                    "page": page
                },
                "data": serializedData
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
        if (!name) {
            throw Error("All fields required!")
        }
        if (name.length < 2) {
            throw Error("Length is too short")
        }

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
        res.status(400).json({ error: error.message })
    }
})

module.exports = router;
