const express = require('express')
const bcrypt = require("bcrypt")
const { PrismaClient } = require("@prisma/client");
const { Snowflake } = require('@theinternetfolks/snowflake');
const jwt = require("jsonwebtoken");
const reqAuth = require('../../middleware/authmiddleware');
const prisma = new PrismaClient();
const validator = require("validator")
const router = express.Router()

function createToken(id) {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: "3d" })
}

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const id = Snowflake.generate();
    try {
        if (!name || !email || !password) {
            throw Error("All fields are required!!");
        }

        if (name.length < 2) {
            throw Error("Length is too short")
        }

        if (!validator.isEmail(email)) {
            throw Error("Not a valid email")
        }

        if (password.length < 6) {
            throw Error("Password is too short")
        }

        const exists = await prisma.user.findFirst({
            where: {
                email
            }
        })
        if (exists) {
            throw Error("User already exists")
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)
        const user = await prisma.user.create({
            data: {
                id,
                name,
                email,
                password: hash
            }
        })
        const token = createToken(user.id.toString(), user.email);
        res.json({
            "status": true,
            "content": {
                "data": { id: user.id.toString(), name: user.name, email: user.email, created_at: user.created_at },
                "meta": {
                    "access_token": token
                }
            }
        });
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: error.message })
    }
})


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw Error("All fields are required!");
        }
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            throw Error("Password is incorrect!")
        }

        const token = createToken(user.id.toString(), email);

        res.json({
            "status": true,
            "content": {
                "data": { id: user.id.toString(), name: user.name, email: user.email, created_at: user.created_at },
                "meta": {
                    "access_token": token
                }
            }
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message })
    }
})

router.get("/me", reqAuth, async (req, res) => {

    try {
        const user = await prisma.user.findFirst({
            where: {
                id: req.user.id
            }
        })
        res.json({
            "status": true,
            "content": {
                "data": { id: user.id.toString(), name: user.name, email: user.email, created_at: user.created_at },
            }
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: error.message })
    }

})

module.exports = router