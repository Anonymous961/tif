const express = require('express');
const slug = require('slug');
const { PrismaClient } = require("@prisma/client");
const { Snowflake } = require('@theinternetfolks/snowflake');
const prisma = new PrismaClient();
const reqAuth = require('../../middleware/authmiddleware');
const utils = require("../../utils")
const router = express.Router()

router.post("/", reqAuth, async (req, res) => {
    const { name } = req.body;
    const communityId = Snowflake.generate();
    const sl = slug(name);

    try {
        if (name.length < 2) {
            throw Error("Name is too short")
        }

        const community = await prisma.community.create({
            data: {
                id: communityId,
                name,
                owners: {
                    set: [req.user.id]
                },
                slug: sl
            },
        })

        const adminRole = await prisma.role.findFirst({
            where: {
                name: "Community Admin"
            }
        })

        if (!adminRole) {
            throw Error("Admin role not found")
        }

        const memberId = Snowflake.generate();
        const member = await prisma.member.create({
            data: {
                id: memberId,
                community: {
                    connect: {
                        id: community.id
                    }
                },
                user: {
                    connect: {
                        id: req.user.id
                    }
                },
                role: {
                    connect: {
                        id: adminRole.id
                    }
                }
            }
        })
        res.json({
            "status": true,
            "content": {
                "data": utils.serializeJSONWithBigInt(community),
            }
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({ error })
    }
})

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalCommunities = await prisma.community.count();
        const totalPages = Math.ceil(totalCommunities / limit);

        const communities = await prisma.community.findMany({
            skip,
            take: limit
        });

        const users = await prisma.user.findMany();

        const communitiesWithOwners = communities.map(community => ({
            ...community,
            owners: users.filter(user => community.owners.includes(user.id)).map(user => ({ id: user.id, name: user.name }))
        }));

        const serializedData = utils.serializeJSONWithBigInt(communitiesWithOwners);

        res.json({
            "status": true,
            "content": {
                "meta": {
                    "total": totalCommunities,
                    "pages": totalPages,
                    "page": page
                },
                "data": serializedData
            }
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message })
    }
})

router.get("/:id/members", async (req, res) => {
    const communityId = req.params.id;
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalMembers = await prisma.member.count({
            where: {
                communityId,
            }
        });

        const totalPages = Math.ceil(totalMembers / limit);

        const members = await prisma.member.findMany({
            where: {
                communityId,
            },
            include: {
                roleId: false,
                role: {
                    select: {
                        id: true, name: true
                    }
                },
                user: {
                    select: {
                        id: true, name: true
                    }
                }
            },
            skip,
            take: limit
        })

        const serializedData = utils.serializeJSONWithBigInt(members);

        res.json({
            "status": true,
            "content": {
                "meta": {
                    "total": totalMembers,
                    "pages": totalPages,
                    "page": page
                },
                "data": serializedData
            }
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message })
    }
})

router.get("/me/owner", reqAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const myCommunities = await prisma.member.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                community: {
                    select: {
                        owners: true
                    }
                }
            },
            skip,
            take: limit
        });

        const ownedCommunities = myCommunities.filter(c => c.community.owners.includes(req.user.id)).map(c => {
            const { community, ...rest } = c;

            return ({
                ...rest,
                owner: req.user.id
            })
        });

        const totalPages = Math.ceil(ownedCommunities.length / limit);
        const totalCommunities = ownedCommunities.length;
        const serializedData = utils.serializeJSONWithBigInt(ownedCommunities);

        res.json({
            "status": true,
            "content": {
                "meta": {
                    "total": totalCommunities,
                    "pages": totalPages,
                    "page": page
                },
                "data": serializedData
            }
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message })
    }
})

router.get("/me/member", reqAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalCommunities = await prisma.member.count({
            where: {
                userId: req.user.id,
            }
        })

        const myCommunities = await prisma.member.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                community: {
                    select: {
                        owners: true
                    }
                }
            },
            skip,
            take: limit
        });

        const users = await prisma.user.findMany();

        const communitiesWithOwners = myCommunities.map(c => {
            const { community, ...rest } = c;

            return ({
                ...rest,
                owners: users.filter(user => community.owners.includes(user.id)).map(user => ({ id: user.id, name: user.name }))
            })
        });

        const totalPages = Math.ceil(totalCommunities / limit);
        const serializedData = utils.serializeJSONWithBigInt(communitiesWithOwners);

        res.json({
            "status": true,
            "content": {
                "meta": {
                    "total": totalCommunities,
                    "pages": totalPages,
                    "page": page
                },
                "data": serializedData
            }
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message })
    }
})

module.exports = router