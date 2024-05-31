const express = require('express');
const slug = require('slug');
const { PrismaClient } = require("@prisma/client");
const { Snowflake } = require('@theinternetfolks/snowflake');
const prisma = new PrismaClient();
const reqAuth = require('../../middleware/authmiddleware');
const router = express.Router()


router.post("/", reqAuth, async (req, res) => {
    const { name } = req.body;
    const id = Snowflake.generate();
    const sl = slug(name);

    try {
        const community = await prisma.community.create({
            data: {
                id,
                name,
                owner: {
                    connect: {
                        id: req.user.id
                    }
                },
                slug: sl
            },
            include: {
                owner: true
            }
        })

        res.json({
            "status": true,
            "content": {
                "data": { id: community.id.toString(), name: community.name, slug: community.slug, owner: community.owner[0].id.toString(), created_at: community.created_at, updated_at: community.updated_at },
            }
        })
    } catch (error) {
        console.error(error);
        res.status(200).json({ error })
    }
})

router.get("/", async (req, res) => {
    try {
        const communities = await prisma.community.findMany({
            include: {
                owner: true
            }
        });
        const serializedCommunities = communities.map(community => ({
            ...community, id: community.id.toString(), owner: community.owner.map((owner) => ({
                id: owner.id.toString(),
                name: owner.name
            }))
        }))
        res.json({
            "status": true,
            "content": {
                "meta": {
                    "total": 3,
                    "pages": 1,
                    "page": 1
                },
                "data": serializedCommunities
            }
        })
    } catch (error) {
        console.error(error);
        res.status(200).json({ error })
    }
})



module.exports = router