var express = require("express");
var router = express.Router();
const db = require('../models');

router.post("/", async (req, res) => {
    const insertQuery = `INSERT INTO "Users"
                        ("Username", "Email", "Password", "CreatedDate")
                        VALUES
                        (:username, :email, :password, :date);`;

    try {
        const newUserResult = await db.sequelize
            .query(
                insertQuery,
                {
                    replacements: {
                        ...req.body,
                        date: new Date,
                    },
                    type: db.sequelize.QueryTypes.INSERT
                }
            );
        res.status(201).json(newUserResult);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;
