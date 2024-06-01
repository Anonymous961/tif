const express = require('express')
const { PrismaClient } = require("@prisma/client");
const { Snowflake } = require('@theinternetfolks/snowflake');
const reqAuth = require('../../middleware/authmiddleware');
const utils = require('../../utils');

const prisma = new PrismaClient();
const router = express.Router()

router.post("/", reqAuth, async (req, res) => {
    const { community: communityId, user: userId, role: roleId } = req.body;
    const memberId = Snowflake.generate();

    try {
        const isAdmin = await prisma.member.findFirst({
            where: {
                communityId: communityId,
                userId: req.user.id,
                role: {
                    name: "Community Admin"
                }
            }
        })

        if (!isAdmin) {
            return res.status(403).json({ error: "NOT_ALLOWED_ACCESS" })
        }

        const newMember = await prisma.member.create({
            data: {
                id: memberId,
                community: {
                    connect: {
                        id: communityId
                    }
                },
                user: {
                    connect: {
                        id: userId
                    }
                },
                role: {
                    connect: {
                        id: roleId
                    }
                }
            },
        })

        res.status(201).json({
            "status": true,
            "content": {
                "data": utils.serializeJSONWithBigInt(newMember)
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
})

router.delete("/:id", reqAuth, async (req, res) => {
    const { id: userId } = req.params;
    const { communityId } = req.body;

    try {
        // members -> req.user.id -> role (admin) // members -> req.user.id -> communityId
        // members -> userId -> communityId
        // C1 A1 B   C2 A2 B  //
        const isAdmin = await prisma.member.findFirst({
            where: {
                communityId: communityId,
                userId: req.user.id,
                role: {
                    name: "Community Admin"
                }
            }
        })
        // console.log(isAdmin);
        if (!isAdmin) {
            return res.status(403).json({ error: "NOT_ALLOWED_ACCESS" });
        }

        console.log({ userId, communityId });

        const isMember = await prisma.member.findFirst({
            where: {
                userId,
                communityId,
            }
        })

        if (!isMember) {
            return res.status(404).json({
                "status": false,
                "message": "User not found."
            })
        }

        await prisma.member.delete({
            where: {
                id: isMember.id
            }
        })

        res.json({
            "status": true
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
})

module.exports = router